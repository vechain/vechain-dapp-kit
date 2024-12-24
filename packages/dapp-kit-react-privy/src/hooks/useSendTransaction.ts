'use client';

import { useTxReceipt } from './useTxReceipt';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useConnex } from '@vechain/dapp-kit-react';
import { Transaction } from 'thor-devkit';
import { useDAppKitPrivyConfig } from '../providers/DAppKitPrivyProvider';
import { useWallet } from './useWallet';
import { useSmartAccount } from './useSmartAccount';
import {
    EnhancedClause,
    TransactionStatus,
    TransactionStatusErrorType,
} from '../utils';

const estimateTxGasWithNext = async (
    clauses: Connex.VM.Clause[],
    caller: string,
    buffer = 1.25,
    nodeUrl: string,
) => {
    type InspectClausesResponse = {
        data: string;
        gasUsed: number;
        reverted: boolean;
        vmError: string;
        events: Connex.VM.Event[];
        transfers: Connex.VM.Transfer[];
    }[];

    // Send tx details to the node to get the gas estimate
    const response = await fetch(`${nodeUrl}/accounts/*?revision=next`, {
        method: 'POST',
        body: JSON.stringify({
            clauses: clauses.map((clause) => ({
                to: clause.to,
                value: clause.value || '0x0',
                data: clause.data,
            })),
            caller,
        }),
    });

    if (!response.ok) throw new Error('Failed to estimate gas');

    const outputs = (await response.json()) as InspectClausesResponse;

    const execGas = outputs.reduce((sum, out) => sum + out.gasUsed, 0);

    // Calculate the intrinsic gas (transaction fee) cast is needed as data could be undefined in Connex.Vm.Clause
    const intrinsicGas = Transaction.intrinsicGas(
        clauses as Transaction.Clause[],
    );

    // 15000 is the fee for invoking the VM
    // Gas estimate is the sum of intrinsic gas and execution gas
    const gasEstimate = intrinsicGas + (execGas ? execGas + 15000 : 0);

    // Add a % buffer to the gas estimate
    return Math.round(gasEstimate * buffer);
};

/**
 * Props for the {@link useSendTransaction} hook
 * @param signerAccountAddress the signer account to use
 * @param clauses clauses to send in the transaction
 * @param onTxConfirmed callback to run when the tx is confirmed
 * @param onTxFailedOrCancelled callback to run when the tx fails or is cancelled
 * @param suggestedMaxGas the suggested max gas for the transaction
 */
type UseSendTransactionProps = {
    signerAccountAddress?: string | null;
    clauses?:
        | EnhancedClause[]
        | (() => EnhancedClause[])
        | (() => Promise<EnhancedClause[]>);
    onTxConfirmed?: () => void | Promise<void>;
    onTxFailedOrCancelled?: () => void | Promise<void>;
    suggestedMaxGas?: number;
    privyUIOptions?: {
        title?: string;
        description?: string;
        buttonText?: string;
    };
};

/**
 * Return value of the {@link useSendTransaction} hook
 * @param sendTransaction function to trigger the transaction
 * @param isTransactionPending boolean indicating if the transaction is waiting for the wallet to sign it
 * @param txReceipt the transaction receipt
 * @param status the status of the transaction (see {@link TransactionStatus})
 * @param resetStatus function to reset the status to "ready"
 * @param error error that occurred while sending the transaction
 */
export type UseSendTransactionReturnValue = {
    sendTransaction: (clauses?: EnhancedClause[]) => Promise<void>;
    isTransactionPending: boolean;
    txReceipt: Connex.Thor.Transaction.Receipt | null;
    status: TransactionStatus;
    resetStatus: () => void;
    error?: TransactionStatusErrorType;
};

/**
 * Generic hook to send a transaction using connex.
 * This hook supports both Privy and VeChain wallets.
 *
 * It returns a function to send the transaction and a status to indicate the state
 * of the transaction (together with the transaction id).
 *
 * @param signerAccount the signer account to use
 * @param clauses clauses to send in the transaction
 * @param onTxConfirmed callback to run when the tx is confirmed
 * @param onTxFailedOrCancelled callback to run when the tx fails or is cancelled
 * @param suggestedMaxGas the suggested max gas for the transaction
 * @param privyUIOptions options to pass to the Privy UI
 * @returns see {@link UseSendTransactionReturnValue}
 */
export const useSendTransaction = ({
    signerAccountAddress,
    clauses,
    onTxConfirmed,
    onTxFailedOrCancelled,
    suggestedMaxGas,
    privyUIOptions,
}: UseSendTransactionProps): UseSendTransactionReturnValue => {
    const { vendor, thor } = useConnex();
    const { dappKitConfig, feeDelegationConfig } = useDAppKitPrivyConfig();
    const nodeUrl = dappKitConfig.nodeUrl;

    const { connection } = useWallet();
    const smartAccount = useSmartAccount();

    /**
     * Convert the clauses to the format expected by the vendor
     * If the clauses are a function, it will be executed and the result will be used
     * If the clauses are an array, it will be used directly
     * If the wallet is connected with Privy, the clauses will be converted to the format expected by the vendor
     * @param clauses the clauses to convert
     * @returns the converted clauses
     */
    async function convertClauses(
        clauses:
            | EnhancedClause[]
            | (() => EnhancedClause[])
            | (() => Promise<EnhancedClause[]>),
    ) {
        let parsedClauses;

        if (typeof clauses === 'function') {
            parsedClauses = await clauses();
        } else {
            parsedClauses = clauses;
        }

        if (connection.isConnectedWithPrivy) {
            return parsedClauses.map((clause) => {
                return {
                    to: clause.to ?? '',
                    value: clause.value,
                    data: clause.data ?? '',
                };
            });
        }

        return parsedClauses;
    }

    /**
     * Send a transaction with the given clauses (in case you need to pass data to build the clauses to mutate directly)
     * If the wallet is connected with Privy, the smart account provider will be used to send the transaction
     * @returns see {@link UseSendTransactionReturnValue}
     */
    const sendTransaction = useCallback(
        async (clauses: EnhancedClause[]) => {
            if (connection.isConnectedWithPrivy) {
                return await smartAccount.sendTransaction({
                    txClauses: clauses,
                    ...privyUIOptions,
                });
            }

            let transaction = vendor.sign('tx', clauses);

            if (feeDelegationConfig.delegateAllTransactions) {
                transaction = transaction.delegate(
                    feeDelegationConfig.delegatorUrl,
                );
            }

            if (signerAccountAddress) {
                let gasLimitNext;
                try {
                    gasLimitNext = await estimateTxGasWithNext(
                        [...clauses],
                        signerAccountAddress,
                        undefined,
                        nodeUrl,
                    );
                } catch (e) {
                    console.error('Gas estimation failed', e);
                }

                const parsedGasLimit = Math.max(
                    gasLimitNext ?? 0,
                    suggestedMaxGas ?? 0,
                );
                // specify gasLimit if we have a suggested or an estimation
                if (parsedGasLimit > 0)
                    return transaction
                        .signer(signerAccountAddress)
                        .gas(parseInt(parsedGasLimit.toString()))
                        .request();
                else return transaction.signer(signerAccountAddress).request();
            }
            return transaction.request();
        },
        [vendor, signerAccountAddress, suggestedMaxGas, nodeUrl, smartAccount],
    );

    /**
     * Adapter to send the transaction with the clauses passed to the hook or the ones passed to the function,
     * and to store the transaction id and the status of the transaction (pending, success, error).
     */
    const [sendTransactionTx, setSendTransactionTx] = useState<string | null>(
        null,
    );
    const [sendTransactionPending, setSendTransactionPending] = useState(false);
    const [sendTransactionError, setSendTransactionError] = useState<
        string | null
    >(null);

    const sendTransactionAdapter = useCallback(
        async (_clauses?: EnhancedClause[]): Promise<void> => {
            if (!_clauses && !clauses) throw new Error('clauses are required');
            try {
                setSendTransactionTx(null);
                setSendTransactionPending(true);
                setSendTransactionError(null);
                const response = await sendTransaction(
                    await convertClauses(_clauses ?? []),
                );
                // If we send the transaction with the smart account, we get the txid as a string
                if (typeof response === 'string') {
                    setSendTransactionTx(response);
                } else if (typeof response === 'object') {
                    // If we send the transaction with the vendor, we get the txid from TxResponse
                    const responseCopy = response as Connex.Vendor.TxResponse;
                    setSendTransactionTx(responseCopy?.txid);
                }
            } catch (error) {
                setSendTransactionError(
                    error instanceof Error ? error.message : String(error),
                );
                onTxFailedOrCancelled?.();
                // throw error;
            } finally {
                setSendTransactionPending(false);
            }
        },
        [sendTransaction, clauses, convertClauses],
    );

    /**
     * Fetch the transaction receipt once the transaction is broadcasted
     */
    const {
        data: txReceipt,
        isLoading: isTxReceiptLoading,
        error: txReceiptError,
    } = useTxReceipt(sendTransactionTx ?? '');

    /**
     * Explain the revert reason of the transaction
     * @param txReceipt the transaction receipt
     * @returns the revert reason
     */
    const explainTxRevertReason = useCallback(
        async (txReceipt: Connex.Thor.Transaction.Receipt) => {
            if (!txReceipt.reverted) return;
            const transactionData = await thor
                .transaction(txReceipt.meta.txID)
                .get();
            if (!transactionData) return;

            return await thor
                .explain(transactionData.clauses)
                .caller(transactionData.origin)
                .execute();
        },
        [thor],
    );

    /**
     * General error that is set when
     * - unable to send the tx
     * - unable to fetch the receipt
     * - the transaction is reverted
     */
    const [error, setError] = useState<TransactionStatusErrorType>();

    /**
     * The status of the transaction
     */
    const status = useMemo(() => {
        if (sendTransactionPending) return 'pending';

        if (sendTransactionError) {
            return 'error';
        }

        if (sendTransactionTx) {
            if (isTxReceiptLoading) return 'waitingConfirmation';
            if (txReceiptError) {
                return 'error';
            }
            if (txReceipt) {
                if (txReceipt.reverted) {
                    return 'error';
                }
                return 'success';
            }
        }

        return 'ready';
    }, [
        isTxReceiptLoading,
        sendTransactionError,
        sendTransactionPending,
        sendTransactionTx,
        txReceipt,
        txReceiptError,
    ]);

    /**
     * If the transaction is successful or in error, explain the revert reason
     */
    useEffect(() => {
        if (status === 'success' || status === 'error') {
            if (sendTransactionError && !error) {
                setError({
                    type: 'UserRejectedError',
                    reason: sendTransactionError,
                });
                return;
            }

            if (txReceipt?.reverted && !error?.type) {
                (async () => {
                    const revertReason = await explainTxRevertReason(txReceipt);
                    setError({
                        type: 'RevertReasonError',
                        reason:
                            revertReason?.[0]?.revertReason ??
                            'Transaction reverted',
                    });
                })();
                return;
            }

            if (txReceipt && !txReceipt.reverted) {
                onTxConfirmed?.();
            }
        }
    }, [
        status,
        txReceipt,
        onTxConfirmed,
        explainTxRevertReason,
        sendTransactionError,
    ]);

    /**
     * Reset the status of the transaction
     */
    const resetStatus = useCallback(() => {
        setSendTransactionTx(null);
        setSendTransactionPending(false);
        setSendTransactionError(null);
        setError(undefined);
    }, []);

    /**
     * Check if the transaction is pending
     */
    const isTransactionPending = useMemo(() => {
        return (
            sendTransactionPending ||
            isTxReceiptLoading ||
            status === 'pending' ||
            status === 'waitingConfirmation'
        );
    }, [sendTransactionPending, isTxReceiptLoading, status]);

    return {
        sendTransaction: sendTransactionAdapter,
        isTransactionPending,
        txReceipt: txReceipt ?? null,
        status,
        resetStatus,
        error,
    };
};
