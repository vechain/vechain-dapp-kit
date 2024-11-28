"use client";

import { useTxReceipt } from "./useTxReceipt";
import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { useConnex } from "@vechain/dapp-kit-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Abi } from "viem";
import { useSmartAccount } from "./useSmartAccount";

/**
 * ready: the user has not clicked on the button yet
 * pending: the user has clicked on the button and we're waiting for the transaction to be sent
 * waitingConfirmation: the transaction has been sent and we're waiting for the transaction to be confirmed by the chain
 * success: the transaction has been confirmed by the chain
 * error: the transaction has failed
 */
export type TransactionStatus =
  | "ready"
  | "pending"
  | "waitingConfirmation"
  | "success"
  | "error";

export type TransactionStatusErrorType = {
  type: "SendTransactionError" | "TxReceiptError" | "RevertReasonError";
  reason?: string;
};

/**
 * An enhanced clause with a comment and an abi
 * @param comment a comment to add to the clause
 * @param abi the abi of the contract to call
 */
export type EnhancedClause = Connex.VM.Clause & {
  comment?: string;
  abi?: object;
};

export type TransactionData = {
  to: string;
  value: string | number | bigint;
  data:
    | string
    | {
        abi: Abi[] | readonly unknown[];
        functionName: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        args: any[];
      };
};

type UseSendAbstractedTransactionProps = {
  onTxConfirmed?: () => void | Promise<void>;
  // showErrorToast?: boolean;
};

/**
 * Return value of the {@link useSendTransaction} hook
 * @param sendTransaction function to trigger the transaction
 * @param sendTransactionPending boolean indicating if the transaction is waiting for the wallet to sign it
 * @param sendTransactionError error that occurred while signing the transaction
 * @param isTxReceiptLoading boolean indicating if the transaction receipt is loading from the chain
 * @param txReceiptError error that occurred while fetching the transaction receipt
 * @param txReceipt the transaction receipt
 * @param status the status of the transaction (see {@link TransactionStatus})
 * @param resetStatus function to reset the status to "ready"
 * @param error general error that is set when
 */
export type UseSendTransactionReturnValue = {
  sendTransaction: UseMutateFunction<string, Error, TransactionData[], unknown>;
  sendTransactionTx: string | undefined;
  sendTransactionPending: boolean;
  sendTransactionError: Error | null;
  isTxReceiptLoading: boolean;
  txReceiptError: Error | null;
  txReceipt: Connex.Thor.Transaction.Receipt | null | undefined;
  status: TransactionStatus;
  resetStatus: () => void;
  error?: TransactionStatusErrorType;
};

/**
 * Generic hook to send a transaction and wait for the txReceipt
 * @param clauses clauses to send in the transaction
 * @param onTxConfirmed callback to run when the tx is confirmed
 * @returns see {@link UseSendTransactionReturnValue}
 */
export const useSendAccountAbstractedTransaction = ({
  onTxConfirmed,
  // showErrorToast = true,
}: UseSendAbstractedTransactionProps): UseSendTransactionReturnValue => {
  const { thor } = useConnex();
  const account = useSmartAccount();

  const sendTransaction = useCallback(
    async (data: TransactionData[]) => {
      return account.sendTransaction({
        txClauses: data,
      });
    },
    [account]
  );

  const sendTransactionAdapter = useCallback(
    async (data: TransactionData[]) => {
      return sendTransaction(data);
    },
    [sendTransaction]
  );
  const {
    mutate: runSendTransaction,
    data: sendTransactionTx,
    isPending: sendTransactionPending,
    error: sendTransactionError,
    reset: resetSendTransaction,
  } = useMutation({
    mutationFn: sendTransactionAdapter,
    onError: (error) => {
      setError({
        type: "SendTransactionError",
        reason: error.message,
      });
      /*showErrorToast &&
        toast({
          title: "Error while signing the transaction.",
          description: `${error.message}`,
          status: "error",
          position: "bottom-left",
          duration: 5000,
          isClosable: true,
        });*/
    },
  });

  const {
    data: txReceipt,
    isFetching: isTxReceiptLoading,
    error: txReceiptError,
  } = useTxReceipt(sendTransactionTx);

  const explainTxRevertReason = useCallback(
    async (txReceipt: Connex.Thor.Transaction.Receipt) => {
      if (!txReceipt.reverted) return;
      const transactionData = await thor.transaction(txReceipt.meta.txID).get();
      if (!transactionData) return;

      const explained = await thor
        .explain(transactionData.clauses)
        .caller(transactionData.origin)
        .execute();
      return explained;
    },
    [thor]
  );

  /**
   * General error that is set when
   * - unable to send the tx
   * - unable to fetch the receipt
   * - the transaction is reverted
   */
  const [error, setError] = useState<TransactionStatusErrorType>();

  /**
   * TODO: In case of errors, call the callback
   */

  const status = useMemo(() => {
    if (sendTransactionPending) return "pending";

    if (sendTransactionError) {
      return "error";
    }

    if (sendTransactionTx) {
      if (isTxReceiptLoading) return "waitingConfirmation";
      if (txReceiptError) {
        return "error";
      }
      if (txReceipt) {
        if (txReceipt.reverted) {
          return "error";
        }
        return "success";
      }
    }

    return "ready";
  }, [
    isTxReceiptLoading,
    sendTransactionError,
    sendTransactionPending,
    sendTransactionTx,
    txReceipt,
    txReceiptError,
  ]);

  useEffect(() => {
    if (sendTransactionError) {
      setError({
        type: "SendTransactionError",
        reason: sendTransactionError.message,
      });
    }

    if (sendTransactionTx) {
      if (txReceiptError) {
        setError({
          type: "TxReceiptError",
          reason: txReceiptError.message,
        });
        return;
      }

      if (txReceipt) {
        if (txReceipt.reverted) {
          // TODO: move this code to a separated query
          (async () => {
            const revertReason = await explainTxRevertReason(txReceipt);
            setError({
              type: "RevertReasonError",
              reason: revertReason?.[0]?.revertReason ?? "Transaction reverted",
            });
          })();

          return;
        }
        onTxConfirmed?.();
        return;
      }
    }
  }, [
    sendTransactionPending,
    isTxReceiptLoading,
    sendTransactionError,
    txReceiptError,
    txReceipt,
    onTxConfirmed,
    explainTxRevertReason,
    sendTransactionTx,
  ]);

  const resetStatus = useCallback(() => {
    resetSendTransaction();
    setError(undefined);
  }, [resetSendTransaction]);

  return {
    sendTransaction: runSendTransaction,
    sendTransactionPending,
    sendTransactionError,
    isTxReceiptLoading,
    sendTransactionTx,
    txReceiptError,
    txReceipt,
    status,
    resetStatus,
    error,
  };
};
