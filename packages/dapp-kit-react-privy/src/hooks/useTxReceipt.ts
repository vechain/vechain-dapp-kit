'use client';

import { useState, useEffect } from 'react';
import { useConnex } from '@vechain/dapp-kit-react';

/**
 * Poll the chain for a transaction receipt until it is found (or timeout after 5 blocks)
 * @param thor Thor instance
 * @param id Transaction id
 * @param blocksTimeout Number of blocks to wait for the receipt
 * @returns Transaction receipt
 */
export const pollForReceipt = async (
    thor: Connex.Thor,
    id?: string,
    blocksTimeout = 5,
): Promise<Connex.Thor.Transaction.Receipt> => {
    if (!id) throw new Error('No transaction id provided');

    const transaction = thor.transaction(id);
    let receipt;

    // Query the transaction until it has a receipt
    for (let i = 0; i < blocksTimeout; i++) {
        receipt = await transaction.getReceipt();
        if (receipt) {
            break;
        }
        await thor.ticker().next();
    }

    if (!receipt) {
        throw new Error('Transaction receipt not found');
    }

    const transactionData = await transaction.get();

    if (!transactionData) throw Error('Failed to get TX data');

    return receipt;
};

/**
 * Get the tx receipt of a tx id with a block timeout to wait for the receipt
 * @param txId The tx id to get the receipt
 * @param blockTimeout The block timeout to wait for the receipt
 * @returns The tx receipt
 */
export const useTxReceipt = (txId?: string, blockTimeout?: number) => {
    const { thor } = useConnex();
    const [receipt, setReceipt] =
        useState<Connex.Thor.Transaction.Receipt | null>();
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchReceipt = async () => {
            if (!txId) {
                setReceipt(null);
                return;
            }

            setIsLoading(true);
            try {
                const result = await pollForReceipt(thor, txId, blockTimeout);
                setReceipt(result);
            } catch (e) {
                setError(e instanceof Error ? e : new Error('Unknown error'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchReceipt();
    }, [txId, blockTimeout, thor]);

    return {
        data: receipt,
        error,
        isLoading,
    };
};
