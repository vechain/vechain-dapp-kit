import type {
    ConnectedWallet,
    SignMessageModalUIOptions,
    SignTypedDataParams,
} from '@privy-io/react-auth';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
import {
    AvailableVeChainProviders,
    TransactionRequestInput,
    VeChainAbstractSigner,
} from '@vechain/sdk-network';
import { getAbstractAddress, sendTransactionFunction } from '../utils';
import { type TypedDataDomain, type TypedDataField } from 'ethers';

/**
 * A VeChain signer implementation for abstract accounts.
 * This signer works with Privy's connected wallet and handles transaction signing
 * through abstract account infrastructure.
 */
class SmartAccountSigner extends VeChainAbstractSigner {
    /**
     * Creates a new SmartAccountSigner instance.
     *
     * @param signTypedDataPrivy - Function to sign typed data using Privy
     * @param connectedWallet - The Privy connected wallet instance
     * @param provider - Optional VeChain provider instance
     * @throws {Error} If signTypedDataPrivy is not a function
     */
    constructor(
        private readonly signTypedDataPrivy: (
            typedData: SignTypedDataParams,
            uiOptions?: SignMessageModalUIOptions,
            address?: string,
        ) => Promise<string>,
        private readonly connectedWallet: ConnectedWallet,
        provider?: AvailableVeChainProviders,
    ) {
        // Assert if the transaction can be signed
        if (typeof signTypedDataPrivy !== 'function') {
            throw new Error(
                `SmartAccountSigner.constructor(): signTypedData must be a function.`,
            );
        }

        // Call the parent constructor
        super(provider);
    }

    /**
     * Creates a new instance of this signer connected to the specified provider.
     *
     * @param provider - The VeChain provider to connect to
     * @returns A new signer instance connected to the provider
     */
    connect(provider: AvailableVeChainProviders): this {
        return new SmartAccountSigner(
            this.signTypedDataPrivy,
            this.connectedWallet,
            provider,
        ) as this;
    }

    /**
     * Retrieves the abstract account address for this signer.
     *
     * @returns The abstract account address
     */
    async getAddress(): Promise<string> {
        return await getAbstractAddress(this.connectedWallet.address);
    }

    /**
     * Sends a transaction to the network through the abstract account infrastructure.
     * Automatically populates any missing transaction fields before sending.
     *
     * @param transactionToSend - The transaction request to send
     * @returns The transaction hash
     * @throws {JSONRPCInvalidParams} If no provider is attached to the signer
     */
    async sendTransaction(
        transactionToSend: TransactionRequestInput,
    ): Promise<string> {
        // 1 - Get the provider (needed to send the raw transaction)
        if (this.provider === undefined) {
            throw new JSONRPCInvalidParams(
                'SmartAccountSigner.sendTransaction()',
                'Thor provider is not found into the signer. Please attach a Provider to your signer instance.',
                { transactionToSend },
            );
        }

        const transaction = await this.populateTransaction(transactionToSend);

        return await sendTransactionFunction({
            to: transaction.clauses[0].to as string,
            value: transaction.clauses[0].value,
            data: transaction.clauses[0].data,
            embeddedWallet: this.connectedWallet,
            signTypedData: this.signTypedDataPrivy,
        });
    }

    /**
     * Signs a message according to EIP-191 personal message signing standard.
     *
     * @param message - The message to sign (string or Uint8Array)
     * @returns The signature
     * @throws {Error} Method not implemented
     */
    /* eslint-disable-next-line @typescript-eslint/require-await */
    async signMessage(_message: string | Uint8Array): Promise<string> {
        throw new Error('Method not implemented.');
    }

    /**
     * Signs a transaction without sending it.
     *
     * @param transactionToSign - The transaction to sign
     * @returns The signed transaction
     * @throws {Error} Method not implemented
     */
    /* eslint-disable-next-line @typescript-eslint/require-await */
    async signTransaction(
        _transactionToSign: TransactionRequestInput,
    ): Promise<string> {
        throw new Error('Method not implemented.');
    }

    /**
     * Signs typed data according to EIP-712 standard.
     *
     * @param domain - The domain separator
     * @param types - The type definitions
     * @param value - The data to sign
     * @returns The signature
     * @throws {Error} Method not implemented
     */
    async signTypedData(
        _domain: TypedDataDomain,
        _types: Record<string, TypedDataField[]>,
        _message: Record<string, unknown>,
    ): Promise<string> {
        throw new Error('Method not implemented.');
    }
}

export { SmartAccountSigner };
