import {
    AvailableVechainProviders,
    RPC_METHODS,
    TransactionRequestInput,
    TransactionSimulationResult,
    VechainSigner,
    vnsUtils,
} from '@vechain/sdk-network';
import { WalletManager } from './wallet-manager';
import {
    addressUtils,
    clauseBuilder,
    Hex0x,
    secp256k1,
    TransactionBody,
    TransactionClause,
} from '@vechain/sdk-core';
import { assert, DATA, JSONRPC } from '@vechain/sdk-errors';

class DAppKitSigner implements VechainSigner {
    constructor(
        public readonly provider: AvailableVechainProviders,
        private readonly wallet: WalletManager,
        private readonly address: string,
    ) {}

    resolveName(vnsName: string): Promise<null | string> {
        if (this.provider === null) {
            return Promise.resolve(null);
        }

        return vnsUtils.resolveName(this.provider.thorClient, vnsName);
    }

    connect(provider: AvailableVechainProviders | null): this {
        return new DAppKitSigner(
            provider ?? this.provider,
            this.wallet,
            this.address,
        ) as this;
    }

    getAddress(): Promise<string> {
        return Promise.resolve(addressUtils.toERC55Checksum(this.address));
    }

    async populateCall(
        transactionToPopulate: TransactionRequestInput,
    ): Promise<TransactionRequestInput> {
        // 1 - Add from field (if not provided)
        if (
            transactionToPopulate.from === undefined ||
            transactionToPopulate.from === null
        )
            transactionToPopulate.from = addressUtils.toERC55Checksum(
                await this.getAddress(),
            );
        // Throw an error if the from address does not match the signer address
        // @note: this because we cannot sign a transaction with a different address
        else
            assert(
                'populateCall',
                addressUtils.toERC55Checksum(transactionToPopulate.from) ===
                    addressUtils.toERC55Checksum(await this.getAddress()),
                DATA.INVALID_DATA_TYPE,
                'From address does not match the signer address.',
                {
                    signerAddress: addressUtils.toERC55Checksum(
                        await this.getAddress(),
                    ),
                    fromAddress: addressUtils.toERC55Checksum(
                        transactionToPopulate.from,
                    ),
                },
            );

        // 2 - Set to field
        if (transactionToPopulate.to === undefined)
            transactionToPopulate.to = null;

        // 3 - Use directly clauses, if they are provided
        if (
            transactionToPopulate.clauses !== undefined &&
            transactionToPopulate.clauses.length > 0
        ) {
            // 2.1 - Set to, value and data fields to be consistent
            transactionToPopulate.to = transactionToPopulate.clauses[0].to;
            transactionToPopulate.value =
                transactionToPopulate.clauses[0].value;
            transactionToPopulate.data = transactionToPopulate.clauses[0].data;
        }

        // Return the transaction
        return transactionToPopulate;
    }

    async populateTransaction(
        transactionToPopulate: TransactionRequestInput,
    ): Promise<TransactionBody> {
        // 1 - Get the thor client
        assert(
            'populateTransaction',
            this.provider.thorClient !== null,
            JSONRPC.INVALID_PARAMS,
            'Thor client not found into the signer. Please attach a Provider with a thor client to your signer instance.',
        );
        const thorClient = this.provider.thorClient;

        // 2 - Populate the call, to get proper 'from' and 'to' address (compatible with multi-clause transactions)
        const populatedTransaction = await this.populateCall(
            transactionToPopulate,
        );

        // 3 - Estimate gas
        const totalGasResult = await this.estimateGas(transactionToPopulate);

        // 4 - Build the transaction body
        return thorClient.transactions.buildTransactionBody(
            populatedTransaction.clauses ??
                this._buildClauses(populatedTransaction),
            totalGasResult,
            {
                isDelegated: this.provider.enableDelegation,
                nonce:
                    populatedTransaction.nonce ??
                    (await this.getNonce('pending')),
                blockRef: populatedTransaction.blockRef ?? undefined,
                chainTag: populatedTransaction.chainTag ?? undefined,
                dependsOn: populatedTransaction.dependsOn ?? undefined,
                expiration: populatedTransaction.expiration,
                gasPriceCoef: populatedTransaction.gasPriceCoef ?? undefined,
            },
        );
    }

    async estimateGas(
        transactionToEstimate: TransactionRequestInput,
    ): Promise<number> {
        // 1 - Get the thor client
        assert(
            'populateTransaction',
            this.provider.thorClient !== null,
            JSONRPC.INVALID_PARAMS,
            'Thor client not found into the signer. Please attach a Provider with a thor client to your signer instance.',
        );
        const thorClient = this.provider.thorClient;

        // 2 - Populate the call, to get proper from and to address (compatible with multi-clause transactions)
        const populatedTransaction = await this.populateCall(
            transactionToEstimate,
        );

        // 3 - Estimate gas
        const gasEstimation = await thorClient.gas.estimateGas(
            populatedTransaction.clauses ??
                this._buildClauses(populatedTransaction),
            populatedTransaction.from ?? undefined,
        );

        // Return the gas estimation
        return gasEstimation.totalGas;
    }

    async call(
        transactionToEvaluate: TransactionRequestInput,
        revision?: string,
    ): Promise<TransactionSimulationResult[]> {
        // 1 - Get the thor client
        assert(
            'call',
            this.provider.thorClient !== null,
            JSONRPC.INVALID_PARAMS,
            'Thor client not found into the signer. Please attach a Provider with a thor client to your signer instance.',
        );
        const thorClient = this.provider.thorClient;

        // 2 - Populate the call, to get proper from and to address (compatible with multi-clause transactions)
        const populatedTransaction = await this.populateCall(
            transactionToEvaluate,
        );

        // 3 - Evaluate the transaction
        return thorClient.transactions.simulateTransaction(
            populatedTransaction.clauses ??
                this._buildClauses(populatedTransaction),
            {
                revision: revision ?? undefined,
                gas: (populatedTransaction.gas as number) ?? undefined,
                gasPrice: populatedTransaction.gasPrice ?? undefined,
                caller: populatedTransaction.from as string,
                provedWork: populatedTransaction.provedWork ?? undefined,
                gasPayer: populatedTransaction.gasPayer ?? undefined,
                expiration: populatedTransaction.expiration ?? undefined,
                blockRef: populatedTransaction.blockRef ?? undefined,
            },
        );
    }

    async getNonce(blockTag?: string): Promise<string> {
        if (this.provider !== null) {
            return (await this.provider.request({
                method: RPC_METHODS.eth_getTransactionCount,
                params: [await this.getAddress(), blockTag],
            })) as string;
        }

        return Promise.resolve(Hex0x.of(secp256k1.randomBytes(6)));
    }

    signTransaction(): Promise<string> {
        throw new Error('Sign transaction is not possible with remote wallets');
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

        const res = await this.wallet.requestTransaction(clauses);

        return res.txid;
    }

    /**
     * Build the transaction clauses
     * form a transaction given as input
     *
     * @param transaction - The transaction to sign
     * @returns The transaction clauses
     */
    private _buildClauses(
        transaction: TransactionRequestInput,
    ): TransactionClause[] {
        return transaction.to !== undefined && transaction.to !== null
            ? // Normal transaction
              [
                  {
                      to: transaction.to,
                      data: transaction.data ?? '0x',
                      value: transaction.value ?? '0x0',
                  } satisfies TransactionClause,
              ]
            : // If 'to' address is not provided, it will be assumed that the transaction is a contract creation transaction.
              [clauseBuilder.deployContract(transaction.data ?? '0x')];
    }

    signTransactionWithDelegator(): Promise<string> {
        return Promise.reject(
            new Error("TODO: Implement 'signTransactionWithDelegator'"),
        );
    }
}

export { DAppKitSigner };
