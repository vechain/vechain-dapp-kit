import {
    Address,
    Hex,
    Transaction,
    TransactionHandler,
    secp256k1,
    vechain_sdk_core_ethers as ethers,
    type TransactionBody,
} from '@vechain/sdk-core';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
import {
    DelegationHandler,
    SignTransactionOptions,
    ThorClient,
    AvailableVeChainProviders,
    TransactionRequestInput,
    VeChainAbstractSigner,
} from '@vechain/sdk-network';

class VeChainSignerDappKit extends VeChainAbstractSigner {
    signer: Connex.Signer;
    address: string;

    constructor(
        signer: Connex.Signer,
        address: string,
        provider: AvailableVeChainProviders | null,
    ) {
        // Call the parent constructor
        super(provider);

        this.address = address;
        this.signer = signer;
    }

    connect(provider: AvailableVeChainProviders | null): this {
        return new VeChainSignerDappKit(
            this.signer,
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
                'Thor provider is not found into the signer. Please attach a Provider to your signer instance.',
                { transactionToSign },
            );
        }

        const tx = await this._signFlow(
            transactionToSign,
            DelegationHandler(
                await this.provider?.wallet?.getDelegator(),
            ).delegatorOrNull(),
        );

        // Sign the transaction
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
                'Thor provider is not found into the signer. Please attach a Provider to your signer instance.',
                { transactionToSend },
            );
        }

        // 2 - Sign the transaction
        const txResult = await this.signTransaction(transactionToSend);

        // 3 - Send the signed transaction
        return txResult;
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
            clauses = transaction.clauses.map((clause) => {
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
            dependsOn:
                populatedTransaction.dependsOn !== null
                    ? populatedTransaction.dependsOn
                    : '',
            delegator: {
                url: delegator?.delegatorUrl ?? '',
                signer: delegator?.delegatorPrivateKey ?? '',
            },
        };

        return this.signer.signTx(clauses, txOptions);
    }

    async _signWithDelegator(
        unsignedTransactionBody: TransactionBody,
        originPrivateKey: Buffer,
        thorClient: ThorClient,
        delegatorOptions?: SignTransactionOptions,
    ): Promise<string> {
        // Address of the origin account
        const originAddress = Address.ofPrivateKey(originPrivateKey).toString();

        const unsignedTx = new Transaction(unsignedTransactionBody);

        // Sign transaction with origin private key and delegator private key
        if (delegatorOptions?.delegatorPrivateKey !== undefined)
            return Hex.of(
                TransactionHandler.signWithDelegator(
                    unsignedTransactionBody,
                    originPrivateKey,
                    Buffer.from(delegatorOptions?.delegatorPrivateKey, 'hex'),
                ).encoded,
            ).toString();

        // Otherwise, get the signature of the delegator from the delegator endpoint
        const delegatorSignature = await DelegationHandler(
            delegatorOptions,
        ).getDelegationSignatureUsingUrl(
            unsignedTx,
            originAddress,
            thorClient.httpClient,
        );

        // Sign transaction with origin private key
        const originSignature = secp256k1.sign(
            unsignedTx.getSignatureHash(),
            originPrivateKey,
        );

        // Sign the transaction with both signatures. Concat both signatures to get the final signature
        const signature = Buffer.concat([originSignature, delegatorSignature]);

        // Return new signed transaction
        return Hex.of(
            new Transaction(unsignedTx.body, signature).encoded,
        ).toString();
    }
}

export { VeChainSignerDappKit };
