"use client";

import { useQuery } from "@tanstack/react-query";
import { useConnex } from "@vechain/dapp-kit-react";

/**
 * Poll the chain for a transaction receipt until it is found (or timeout after 3 blocks)
 * @param id Transaction id
 * @param blocksTimeout Number of blocks to wait before timeout
 * @returns  Transaction receipt
 */
export const pollForReceipt = async (
  thor: Connex.Thor,
  id?: string,
  blocksTimeout = 5
): Promise<Connex.Thor.Transaction.Receipt> => {
  if (!id) throw new Error("No transaction id provided");

  const transaction = thor.transaction(id);
  let receipt;

  //Query the transaction until it has a receipt
  //Timeout after 3 blocks
  for (let i = 0; i < blocksTimeout; i++) {
    receipt = await transaction.getReceipt();
    if (receipt) {
      break;
    }
    await thor.ticker().next();
  }

  if (!receipt) {
    throw new Error("Transaction receipt not found");
  }

  const transactionData = await transaction.get();

  if (!transactionData) throw Error("Failed to get TX data");

  return receipt;
};
export const txReceiptQueryKey = (txId?: string) => ["TX_RECEIPT", txId];

/**
 *  Get the tx receipt of a tx id with a block timeout to wait for the receipt
 * @param txId  the tx id to get the receipt
 * @param blocksTimeout  the blocks to wait for the receipt
 * @returns  the tx receipt
 */
export const useTxReceipt = (txId?: string, blockTimeout?: number) => {
  const { thor } = useConnex();
  return useQuery({
    queryKey: txReceiptQueryKey(txId),
    queryFn: () =>
      txId ? pollForReceipt(thor, txId, blockTimeout) : undefined,
    enabled: !!txId,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
