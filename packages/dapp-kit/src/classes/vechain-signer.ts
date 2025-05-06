import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
import {
    AvailableVeChainProviders,
    DelegationHandler,
    SignTransactionOptions,
    SignTypedDataOptions,
    TransactionRequestInput,
    TypedDataDomain,
    TypedDataParameter,
    VeChainAbstractSigner,
} from '@vechain/sdk-network';
import type {
    TransactionMessage,
    TransactionOptions,
    TransactionResponse,
} from '../types';
import type { WalletManager } from './wallet-manager';

class VeChainSignerDAppKit extends VeChainAbstractSigner {
    private readonly walletManager: WalletManager;

    constructor(
        walletManager: WalletManager,
        provider: AvailableVeChainProviders,
    ) {
        // Call the parent constructor
        super(provider);
        this.walletManager = walletManager;
    }

    get address(): string | null {
        return this.walletManager.state.address;
    }

    connect(provider: AvailableVeChainProviders): this {
        return new VeChainSignerDAppKit(this.walletManager, provider) as this;
    }

    async getAddress(): Promise<string> {
        const addr = this.walletManager.state.address;
        if (addr === null) {
            throw new JSONRPCInvalidParams(
                'VeChainPrivateKeySigner.getAddress()',
                'No wallet is connected',
                {},
            );
        }
        return Promise.resolve(addr);
    }

    async signTransaction(
        transactionToSign: TransactionRequestInput,
    ): Promise<string> {
        // Check the provider (needed to sign the transaction)
        if (this.provider === null) {
            throw new JSONRPCInvalidParams(
                'VeChainPrivateKeySigner.signTransaction()',
                'Thor provider is not found into the wallet. Please attach a Provider to your wallet instance.',
                { transactionToSign },
            );
        }

        const tx = await this._signFlow(
            transactionToSign,
            DelegationHandler(
                await this.provider?.wallet?.getGasPayer(),
            ).gasPayerOrNull(),
        );

        // Return the transaction hash
        return tx.txid;
    }

    async sendTransaction(
        transactionToSend: TransactionRequestInput,
    ): Promise<string> {
        // 1 - Get the provider (needed to send the raw transaction)
        if (this.provider === null) {
            throw new JSONRPCInvalidParams(
                'VeChainPrivateKeySigner.sendTransaction()',
                'Thor provider is not found into the wallet. Please attach a Provider to your wallet instance.',
                { transactionToSend },
            );
        }

        // 2 - Sign and send the transaction
        return this.signTransaction(transactionToSend);
    }

    async signMessage(_message: string | Uint8Array): Promise<string> {
        return Promise.reject(new Error('Method not implemented.'));
    }

    signTypedData(
        domain: TypedDataDomain,
        types: Record<string, TypedDataParameter[]>,
        message: Record<string, unknown>,
        unused?: string,
        options?: SignTypedDataOptions,
    ): Promise<string> {
        return this.walletManager.signTypedData(
            domain,
            types,
            message,
            options,
        );
    }

    signPayload(): Promise<string> {
        return Promise.reject(new Error('Method not implemented.'));
    }

    async _signFlow(
        transaction: TransactionRequestInput,
        delegator: SignTransactionOptions | null,
    ): Promise<TransactionResponse> {
        // Populate the call, to get proper from and to address (compatible with multi-clause transactions)
        const populatedTransaction =
            await this.populateTransaction(transaction);

        let clauses: TransactionMessage[] = [];

        if (Array.isArray(transaction.clauses)) {
            clauses = populatedTransaction.clauses.map((clause) => {
                return {
                    to: clause.to,
                    value: clause.value,
                    data: clause.data,
                    comment: '',
                    abi: undefined,
                };
            });
        }

        const txOptions: TransactionOptions = {
            signer: this.address,
            gas: Number(transaction.gas),
            dependsOn: populatedTransaction.dependsOn ?? '',
            delegator: {
                url: delegator?.gasPayerServiceUrl ?? '',
            },
        };

        return this.walletManager.signTx(clauses, txOptions);
    }
}

export { VeChainSignerDAppKit };
