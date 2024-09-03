import { vechain_sdk_core_ethers as ethers } from '@vechain/sdk-core';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
import {
    AvailableVeChainProviders,
    DelegationHandler,
    SignTransactionOptions,
    TransactionRequestInput,
    VeChainAbstractSigner,
} from '@vechain/sdk-network';
import { VechainWallet } from '../types';

class VeChainSignerDAppKit extends VeChainAbstractSigner {
    wallet: VechainWallet;
    address: string;

    constructor(
        wallet: VechainWallet,
        address: string,
        provider: AvailableVeChainProviders | null,
    ) {
        // Call the parent constructor
        super(provider);

        this.address = address;
        this.wallet = wallet;
    }

    connect(provider: AvailableVeChainProviders | null): this {
        return new VeChainSignerDAppKit(
            this.wallet,
            this.address,
            provider,
        ) as this;
    }

    async getAddress(): Promise<string> {
        return Promise.resolve(this.address);
    }

    async signTransaction(
        transactionToSign: TransactionRequestInput,
    ): Promise<string> {
        // Check the provider (needed to sign the transaction)
        if (this.provider === null) {
            throw new JSONRPCInvalidParams(
                'VeChainPrivateKeySigner.signTransaction()',
                -32602,
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
                -32602,
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
        _domain: ethers.TypedDataDomain,
        _types: Record<string, ethers.TypedDataField[]>,
        _value: Record<string, unknown>,
    ): Promise<string> {
        return Promise.reject(new Error('Method not implemented.'));
    }

    async _signFlow(
        transaction: TransactionRequestInput,
        delegator: SignTransactionOptions | null,
    ): Promise<Connex.Vendor.TxResponse> {
        // Populate the call, to get proper from and to address (compatible with multi-clause transactions)
        const populatedTransaction = await this.populateTransaction(
            transaction,
        );

        let clauses: (Connex.VM.Clause & {
            comment?: string;
            abi?: object;
        })[] = [];

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

        const txOptions: Connex.Signer.TxOptions = {
            signer: this.address,
            gas: Number(transaction.gas),
            dependsOn: populatedTransaction.dependsOn ?? '',
            delegator: {
                url: delegator?.delegatorUrl ?? '',
                signer: delegator?.delegatorPrivateKey ?? '',
            },
        };

        return this.wallet.signTx(clauses, txOptions);
    }
}

export { VeChainSignerDAppKit };
