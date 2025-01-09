import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
import type {
    AvailableVeChainProviders,
    SignTransactionOptions,
    TransactionRequestInput,
} from '@vechain/sdk-network';
import { DelegationHandler, VeChainAbstractSigner } from '@vechain/sdk-network';
import type {
    TransactionMessage,
    TransactionOptions,
    TransactionResponse,
} from '../types/requests';
import type { WalletManager } from './wallet-manager';
import { TypedDataDomain, TypedDataParameter } from 'viem';

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
                await this.provider?.wallet?.getDelegator(),
            ).delegatorOrNull(),
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

    async signTypedData(
        _domain: TypedDataDomain,
        _types: Record<string, TypedDataParameter[]>,
        _primaryType: string,
        _message: Record<string, unknown>
    ): Promise<string> {
        return Promise.reject(new Error('Method not implemented.'));
    }

    async _signFlow(
        transaction: TransactionRequestInput,
        delegator: SignTransactionOptions | null,
    ): Promise<TransactionResponse> {
        // Populate the call, to get proper from and to address (compatible with multi-clause transactions)
        const populatedTransaction = await this.populateTransaction(
            transaction,
        );

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
                url: delegator?.delegatorUrl ?? '',
                signer: delegator?.delegatorPrivateKey ?? '',
            },
        };

        return this.walletManager.signTx(clauses, txOptions);
    }
}

export { VeChainSignerDAppKit };
