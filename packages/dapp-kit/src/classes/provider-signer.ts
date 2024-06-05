import {
    AvailableVeChainProviders,
    TransactionRequestInput,
    VeChainAbstractSigner,
} from '@vechain/sdk-network';
import { WalletManager } from './wallet-manager';
import { addressUtils, TransactionClause } from '@vechain/sdk-core';
import { assert, JSONRPC } from '@vechain/sdk-errors';
import { DAppKitLogger } from '../utils';

class DAppKitSigner extends VeChainAbstractSigner {
    constructor(
        public readonly provider: AvailableVeChainProviders,
        private readonly wallet: WalletManager,
        private address?: string,
    ) {
        super(provider);
    }

    connect(provider: AvailableVeChainProviders | null): this {
        return new DAppKitSigner(
            provider ?? this.provider,
            this.wallet,
            this.address,
        ) as this;
    }

    async getAddress(): Promise<string> {
        if (this.address) {
            return Promise.resolve(this.address);
        }
        DAppKitLogger.debug('DAppKitSigner', 'getAddress', 'Connecting wallet');

        const res = await this.wallet.connect();
        this.address = res.account;
        return this.address;
    }

    signTransaction(): Promise<string> {
        throw new Error(
            'Sign transaction is not possible with remote wallets, use sendTransaction instead.',
        );
    }

    async sendTransaction(
        transactionToSend: TransactionRequestInput,
    ): Promise<string> {
        // 1 - Get the provider (needed to send the raw transaction)
        assert(
            'sendTransaction',
            this.provider !== null,
            JSONRPC.INVALID_PARAMS,
            'Thor provider is not found into the signer. Please attach a Provider to your signer instance.',
        );

        const clauses: TransactionClause[] = transactionToSend.clauses ?? [];

        if (clauses.length === 0) {
            const { to, value, data } = transactionToSend;

            if (!to && !data) {
                throw new Error(
                    'Invalid transaction: no `to` or `data` provided',
                );
            }

            if (to && !addressUtils.isAddress(to)) {
                throw new Error('Invalid transaction: invalid `to` address');
            }

            clauses.push({
                to: to ?? null,
                value: value ?? '0x0',
                data: data ?? '0x',
            });
        }

        const res = await this.wallet.requestTransaction(clauses, {
            signer: this.address,
        });

        return res.txid;
    }

    signTransactionWithDelegator(): Promise<string> {
        return Promise.reject(
            new Error("TODO: Implement 'signTransactionWithDelegator'"),
        );
    }
}

export { DAppKitSigner };
