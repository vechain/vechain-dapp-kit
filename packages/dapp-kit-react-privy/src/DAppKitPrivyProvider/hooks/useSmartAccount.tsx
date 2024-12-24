'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    useCrossAppAccounts,
    usePrivy,
    useWallets,
    type ConnectedWallet,
} from '@privy-io/react-auth';
import { encodeFunctionData } from 'viem';
import { ABIContract, Address, Clause } from '@vechain/sdk-core';
import {
    ThorClient,
    VeChainProvider,
    ProviderInternalBaseWallet,
    signerUtils,
} from '@vechain/sdk-network';
import { SimpleAccountABI, SimpleAccountFactoryABI } from '../assets';
import {
    ExecuteWithAuthorizationSignData,
    randomTransactionUser,
    ACCOUNT_FACTORY_ADDRESSES,
} from '../utils';

export interface SmartAccountContextType {
    address: string | undefined;
    owner: string | undefined;
    embeddedWallet: ConnectedWallet | undefined;
    isDeployed: boolean;
    sendTransaction: (tx: {
        txClauses: Connex.VM.Clause[];
        title?: string;
        description?: string;
        buttonText?: string;
    }) => Promise<string>;
    exportWallet: () => Promise<void>;
    thor: ThorClient;
    nodeUrl: string;
    delegatorUrl: string;
    accountFactory: string;
    delegateAllTransactions: boolean;
    chainId: string;
}

const VechainAccountContext = createContext<SmartAccountContextType | null>(
    null,
);

/**
 * This provider is responsible for retrieving the smart account address
 * of a Privy wallet and providing the necessary context for the smart account.
 * Upon initialization this provider will execute a few useEffect hooks to:
 * - retrieve the smart account address of the embedded wallet
 * - retrieve the chain id
 * - check if the smart account is deployed
 *
 * It also provides a function to send transactions on vechain by asking the privy wallet
 * to sign the transaction and then forwarding the transaction to the node api.
 * When sending a transaction this provider will check if the smart account is deployed and if not,
 * it will deploy it.
 */
export const SmartAccountProvider = ({
    children,
    nodeUrl,
    delegatorUrl,
    delegateAllTransactions,
}: {
    children: React.ReactNode;
    nodeUrl: string;
    delegatorUrl: string;
    delegateAllTransactions: boolean;
}) => {
    const { signTypedData, exportWallet, user } = usePrivy();
    const { signTypedData: signTypedDataCrossApp } = useCrossAppAccounts();
    const { wallets } = useWallets();
    const embeddedWallet = wallets.find(
        (wallet) => wallet.walletClientType === 'privy',
    );
    const [smartAccountAddress, setSmartAccountAddress] = useState<
        string | undefined
    >();
    const [owner, setOwner] = useState<string | undefined>();
    const [chainId, setChainId] = useState('');
    const thor = ThorClient.at(nodeUrl);
    const [isDeployed, setIsDeployed] = useState(false);
    const [accountFactory, setAccountFactory] = useState<string>();

    const isCrossAppPrivyAccount = Boolean(
        user?.linkedAccounts?.some((account) => account.type === 'cross_app'),
    );

    const connectedAccount = isCrossAppPrivyAccount
        ? //@ts-ignore
          user?.linkedAccounts?.[0]?.embeddedWallets?.[0]?.address
        : //@ts-ignore
          user?.linkedAccounts?.[0]?.address ?? user?.wallet?.address;

    /**
     * Set the owner address to the connected account
     */
    useEffect(() => {
        setOwner(connectedAccount);
    }, [connectedAccount]);

    /**
     * Load the smartAccountAddress of the account abstraction wallet identified by
     * the embedded wallet of Privy.
     */
    useEffect(() => {
        if (
            !embeddedWallet ||
            !accountFactory ||
            !nodeUrl ||
            !delegatorUrl ||
            !connectedAccount
        ) {
            setSmartAccountAddress(undefined);
            setIsDeployed(false);
            return;
        }

        thor.contracts
            .executeCall(
                accountFactory,
                ABIContract.ofAbi(SimpleAccountFactoryABI).getFunction(
                    'getAccountAddress',
                ),
                [connectedAccount],
            )
            .then((accountAddress) => {
                setSmartAccountAddress(String(accountAddress.result.plain));
            })
            .catch((e) => {
                console.error('error', e);
                /* ignore */
            });
    }, [
        embeddedWallet,
        thor,
        accountFactory,
        nodeUrl,
        delegatorUrl,
        connectedAccount,
    ]);

    /**
     * Identify the current chain id from its genesis block
     */
    useEffect(() => {
        thor.blocks
            .getGenesisBlock()
            .then((genesis) => {
                if (genesis?.id) {
                    const chainIdValue = BigInt(genesis.id).toString();
                    setChainId(chainIdValue);
                }
            })
            .catch((error) => {
                console.error('Failed to get genesis block:', error);
            });
    }, [thor]);

    /**
     * Reset smartAccountAddress when embedded wallet vanishes
     */
    useEffect(() => {
        if (!embeddedWallet) {
            setSmartAccountAddress(undefined);
        }
    }, [embeddedWallet]);

    /**
     * Check if the smart account is deployed
     */
    useEffect(() => {
        if (!smartAccountAddress) {
            return;
        }

        thor.accounts
            .getAccount(Address.of(smartAccountAddress))
            .then((account) => {
                setIsDeployed(account.hasCode);
            });
    }, [smartAccountAddress, thor]);

    /**
     * Set the account factory address based on the chain ID
     */
    useEffect(() => {
        if (!chainId) return;

        setAccountFactory(
            ACCOUNT_FACTORY_ADDRESSES[
                chainId as keyof typeof ACCOUNT_FACTORY_ADDRESSES
            ],
        );
    }, [chainId]);

    /**
     * Send a transaction on vechain by asking the privy wallet to sign a typed data content
     * that will allow us the execute the action with his smart account through the executeWithAuthorization
     * function of the smart account.
     */
    const sendTransaction = async ({
        txClauses = [],
        title = 'Sign Transaction',
        description,
        buttonText = 'Sign',
    }: {
        txClauses: Connex.VM.Clause[];
        title?: string;
        description?: string;
        buttonText?: string;
    }): Promise<string> => {
        if (!smartAccountAddress || !embeddedWallet || !connectedAccount) {
            throw new Error('Address or embedded wallet is missing');
        }

        // build the object to be signed, containing all information & instructions
        const dataToSign: ExecuteWithAuthorizationSignData[] = txClauses.map(
            (txData) => ({
                domain: {
                    name: 'Wallet',
                    version: '1',
                    chainId: chainId as unknown as number, // convert chainId to a number
                    verifyingContract: smartAccountAddress,
                },
                types: {
                    ExecuteWithAuthorization: [
                        { name: 'to', type: 'address' },
                        { name: 'value', type: 'uint256' },
                        { name: 'data', type: 'bytes' },
                        { name: 'validAfter', type: 'uint256' },
                        { name: 'validBefore', type: 'uint256' },
                    ],
                },
                primaryType: 'ExecuteWithAuthorization',
                message: {
                    validAfter: 0,
                    validBefore: Math.floor(Date.now() / 1000) + 60, // 1 minute
                    to: txData.to,
                    value: String(txData.value),
                    data:
                        (typeof txData.data === 'object' && 'abi' in txData.data
                            ? encodeFunctionData(txData.data)
                            : txData.data) || '0x',
                },
            }),
        );

        // request signatures using privy
        const signatures: string[] = await Promise.all(
            dataToSign.map((data, index) => {
                const txClause = txClauses[index];
                if (!txClause) {
                    throw new Error(
                        `Transaction clause at index ${index} is undefined`,
                    );
                }

                if (isCrossAppPrivyAccount) {
                    return signTypedDataCrossApp(data, {
                        address: connectedAccount,
                    });
                } else {
                    const funcData = txClause.data;
                    return signTypedData(data, {
                        title,
                        description:
                            description ??
                            (typeof funcData === 'object' &&
                            funcData !== null &&
                            'functionName' in funcData
                                ? (funcData as { functionName: string })
                                      .functionName
                                : ' '),
                        buttonText,
                    });
                }
            }),
        );

        // start building the clauses for the transaction
        const clauses = [];

        // if the account smartAccountAddress has no code yet, it's not been deployed/created yet
        const { hasCode: isDeployed } = await thor.accounts.getAccount(
            Address.of(smartAccountAddress),
        );
        setIsDeployed(isDeployed);
        if (!isDeployed) {
            clauses.push(
                Clause.callFunction(
                    Address.of(accountFactory ?? ''),
                    ABIContract.ofAbi(SimpleAccountFactoryABI).getFunction(
                        'createAccount',
                    ),
                    [connectedAccount], // set the Privy wallet address as the owner of the smart account
                ),
            );
        }

        dataToSign.forEach((data, index) => {
            clauses.push(
                Clause.callFunction(
                    Address.of(smartAccountAddress),
                    ABIContract.ofAbi(SimpleAccountABI).getFunction(
                        'executeWithAuthorization',
                    ),
                    [
                        data.message.to as `0x${string}`,
                        BigInt(data.message.value),
                        data.message.data as `0x${string}`,
                        BigInt(data.message.validAfter),
                        BigInt(data.message.validBefore),
                        signatures[index] as `0x${string}`,
                    ],
                ),
            );
        });

        // estimate the gas fees for the transaction
        const gasResult = await thor.gas.estimateGas(
            clauses,
            connectedAccount,
            {
                gasPadding: 1,
            },
        );

        // build the transaction in VeChain format, with delegation enabled
        const txBody = await thor.transactions.buildTransactionBody(
            clauses,
            gasResult.totalGas,
            { isDelegated: true },
        );

        // sign the transaction and request the fee delegator to pay the gas fees in the process
        const wallet = new ProviderInternalBaseWallet(
            [
                {
                    privateKey: Buffer.from(
                        randomTransactionUser.privateKey.slice(2),
                        'hex',
                    ),
                    address: randomTransactionUser.address,
                },
            ],
            { delegator: { delegatorUrl } },
        );
        const providerWithDelegationEnabled = new VeChainProvider(
            thor,
            wallet,
            true,
        );
        const signer = await providerWithDelegationEnabled.getSigner(
            randomTransactionUser.address,
        );
        const txInput = signerUtils.transactionBodyToTransactionRequestInput(
            txBody,
            randomTransactionUser.address,
        );
        const rawDelegateSigned = await signer!.signTransaction(txInput);

        // publish the hexlified signed transaction directly on the node api
        const { id } = (await fetch(`${nodeUrl}/transactions`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                raw: rawDelegateSigned,
            }),
        }).then((res) => res.json())) as { id: string };

        return id;
    };

    return (
        <VechainAccountContext.Provider
            value={{
                address: smartAccountAddress,
                owner,
                accountFactory: accountFactory ?? '',
                nodeUrl,
                delegatorUrl,
                embeddedWallet,
                sendTransaction,
                exportWallet,
                thor,
                isDeployed,
                delegateAllTransactions,
                chainId,
            }}
        >
            {children}
        </VechainAccountContext.Provider>
    );
};

export const useSmartAccount = () => {
    const context = useContext(VechainAccountContext);
    if (!context) {
        throw new Error(
            'useSmartAccount must be used within a SmartAccountProvider',
        );
    }
    return context;
};
