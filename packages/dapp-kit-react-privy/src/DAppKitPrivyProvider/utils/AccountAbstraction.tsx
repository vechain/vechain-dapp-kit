import { ABIFunction, Address, Clause } from '@vechain/sdk-core';
import {
    type ConnectedWallet,
    type SignMessageModalUIOptions,
    type SignTypedDataParams,
} from '@privy-io/react-auth';
import { type Abi, encodeFunctionData } from 'viem';
import {
    ProviderInternalBaseWallet,
    signerUtils,
    VeChainProvider,
    type VeChainSigner,
} from '@vechain/sdk-network';
import { getAbstractAddress } from '../hooks/AbstractAccount';
import { DELEGATOR_URL, NETWORK_URL, THOR_CLIENT } from './Constants';
import { randomTransactionUser } from './SmartAccountTransactionForwarder';

/**
 * Get the genesis block id
 *
 * @returns The genesis block id
 */
export async function getGenesisId(): Promise<string | null> {
    const genesis = await THOR_CLIENT.blocks.getGenesisBlock();
    return genesis?.id !== null && genesis?.id !== undefined
        ? BigInt(genesis.id).toString()
        : null;
}

/**
 * Send transaction to the blockchain
 * with the account abstraction function
 */
export async function sendTransactionFunction({
    to,
    value = 0,
    data: funcData = '0x',
    title = 'Sign Transaction',
    description,
    buttonText = 'Sign',
    embeddedWallet,
    signTypedData,
}: {
    to?: string;
    value?: number | string | bigint;
    data?:
        | string
        | {
              abi: Abi[] | readonly unknown[];
              functionName: string;
              args: any[];
          };
    validAfter?: number;
    validBefore?: number;
    title?: string;
    description?: string;
    buttonText?: string;
    embeddedWallet?: ConnectedWallet;
    signTypedData: (
        typedData: SignTypedDataParams,
        uiOptions?: SignMessageModalUIOptions,
        address?: string,
    ) => Promise<string>;
}): Promise<string> {
    // Check if the address or embedded wallet is missing
    if (
        embeddedWallet === undefined ||
        (await getAbstractAddress(embeddedWallet.address)) === undefined
    ) {
        throw new Error('Address or embedded wallet is missing');
    }
    // 1 - Get the Chain/Genesis block id
    const genesisId = await getGenesisId();

    if (genesisId === null) {
        throw new Error('Genesis block id is missing');
    }

    // build the object to be signed, containing all information & instructions
    const data = {
        /**
         * the domain is configured in the contracts by this call:
         *  __EIP712_init("Wallet", "1")
         */
        domain: {
            name: 'Wallet',
            version: '1',
            // Work around the viem limitation that chainId must be a number but its too big to be handled as such
            chainId: genesisId as unknown as number,
            verifyingContract: await getAbstractAddress(embeddedWallet.address),
        },

        // type definitions, can be multiples, can be put into a configurational scope
        types: {
            /**
             * the ExecuteWithAuthorization is basically the function definition of
             */
            ExecuteWithAuthorization: [
                { name: 'to', type: 'address' },
                { name: 'value', type: 'uint256' },
                { name: 'data', type: 'bytes' },
                { name: 'validAfter', type: 'uint256' },
                { name: 'validBefore', type: 'uint256' },
            ],
        },
        primaryType: 'ExecuteWithAuthorization',

        /**
         * the message to sign, it is basically the instructions for an execute command
         * to, value and data are transaction relevant
         * validAfter & validBefore are good to limit authorization and will be checked with block.timestamp
         */
        message: {
            // valid by default right now, could also limit for future use
            validAfter: 0,

            // valid for an hour
            validBefore: Math.floor(Date.now() / 1000) + 3600,

            // the transaction instructions
            to,
            value: String(value),

            // decide if the data needs to be encoded first or can be passed directly
            data:
                typeof funcData === 'object' && 'abi' in funcData
                    ? encodeFunctionData(funcData)
                    : funcData,
        },
    };

    /**
     * request a signature using privy
     * the information is show to the user in a modal
     */
    const signature = await signTypedData(data, {
        title,
        description:
            description ??
            (typeof funcData === 'object' && 'functionName' in funcData
                ? funcData.functionName
                : ' '),
        buttonText,
    });

    /**
     * start building the clauses for the transaction
     */
    const clauses = [
        Clause.callFunction(
            Address.of(await getAbstractAddress(embeddedWallet.address)),
            new ABIFunction({
                constant: false,
                inputs: [
                    { name: 'to', type: 'address' },
                    { name: 'value', type: 'uint256' },
                    { name: 'data', type: 'bytes' },
                    { name: 'validAfter', type: 'uint256' },
                    { name: 'validBefore', type: 'uint256' },
                    { name: 'signature', type: 'bytes' },
                ],
                name: 'executeWithAuthorization',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            }),
            [
                data.message.to as `0x${string}`,
                BigInt(data.message.value),
                data.message.data as `0x${string}`,
                BigInt(data.message.validAfter),
                BigInt(data.message.validBefore),
                signature as `0x${string}`,
            ],
        ),
    ];

    // estimate the gas fees for the transaction
    const gasResult = await THOR_CLIENT.gas.estimateGas(clauses);

    // .. and build the transaction in VeChain format, with delegation enabled
    const txBody = await THOR_CLIENT.transactions.buildTransactionBody(
        clauses,
        gasResult.totalGas,
        { isDelegated: true },
    );

    /**
     * Create a random transaction user
     */
    const randomUser = randomTransactionUser;

    /**
     * sign the transaction
     * and request the fee delegator to pay the gas fees in the proccess
     */
    const wallet = new ProviderInternalBaseWallet(
        [
            {
                privateKey: Uint8Array.from(
                    Buffer.from(randomUser.privateKey.slice(2), 'hex'),
                ),
                address: randomUser.address,
            },
        ],
        { delegator: { delegatorUrl: DELEGATOR_URL } },
    );
    const providerWithDelegationEnabled = new VeChainProvider(
        THOR_CLIENT,
        wallet,
        true,
    );
    const signer = await providerWithDelegationEnabled.getSigner(
        randomUser.address,
    );
    const txInput = signerUtils.transactionBodyToTransactionRequestInput(
        txBody,
        randomUser.address,
    );
    const rawDelegateSigned = await (signer as VeChainSigner).signTransaction(
        txInput,
    );

    /**
     * publish the hexlified signed transaction directly on the node api
     */
    const { id } = (await fetch(`${NETWORK_URL}/transactions`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            raw: rawDelegateSigned,
        }),
    }).then(async (res) => await res.json())) as { id: string };

    return id;
}
