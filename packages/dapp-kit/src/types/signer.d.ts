import type { TransactionClause } from '@vechain/sdk-core';
import type { ThorClient } from '@vechain/sdk-network';

type ExtendedClause = TransactionClause & {
    comment?: string;
    abi?: object;
};

/**
 * Defines the options for sending a transaction.
 */
interface SendTxOptions {
    /** The signer for the transaction. */
    signer?: string;
    /** The gas limit for the transaction. */
    gas?: number;
    /** The transaction hash that this transaction depends on. */
    dependsOn?: string;
    /** The callback URL for the transaction ID. */
    link?: string;
    /** The comment for the transaction. */
    comment?: string;
    /** The delegator for the transaction. */
    delegator?: {
        url: string;
        signer?: string;
    };
    /** The callback function that is called when the transaction is sent to the wallet. */
    onAccepted?: () => void;
}

interface WalletTransactionResponse {
    readonly txid: string;
    readonly signer: string;
}

interface TransactionResponse extends WalletTransactionResponse {
    wait: () => ReturnType<ThorClient['transactions']['waitForTransaction']>;
}

interface CertificateResponse {
    annex: {
        domain: string;
        timestamp: number;
        signer: string;
    };
    signature: string;
}

interface CertMessage {
    purpose: 'identification' | 'agreement';
    payload: {
        type: 'text';
        content: string;
    };
}

interface CertOptions {
    signer?: string;
    link?: string;
    onAccepted?: () => void;
}

export type {
    ExtendedClause,
    SendTxOptions,
    WalletTransactionResponse,
    CertificateResponse,
    CertMessage,
    CertOptions,
    TransactionResponse,
};
