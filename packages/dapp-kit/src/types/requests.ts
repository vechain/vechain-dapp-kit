interface TransactionMessage {
    to: string | null;
    value: string | number;
    data?: string;
    comment?: string;
    abi?: object;
}

interface TransactionOptions {
    signer?: string | null;
    gas?: number;
    dependsOn?: string;
    link?: string;
    comment?: string;
    delegator?: {
        url: string;
        signer?: string;
    };
    onAccepted?: () => void;
}

interface TransactionResponse {
    txid: string;
    signer: string;
}

interface CertificateMessage {
    purpose: 'identification' | 'agreement';
    payload: {
        type: 'text';
        content: string;
    };
}

interface CertificateOptions {
    signer?: string;
    link?: string;
    onAccepted?: () => void;
}

interface CertificateResponse {
    annex: {
        domain: string;
        timestamp: number;
        signer: string;
    };
    signature: string;
}

export type {
    TransactionMessage,
    TransactionOptions,
    CertificateMessage,
    CertificateOptions,
    TransactionResponse,
    CertificateResponse,
};
