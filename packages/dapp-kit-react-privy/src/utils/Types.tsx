/**
 * Data that the Privy user must sign in order to execute a transaction
 * by authorizing the Smart Account contract
 */
export type ExecuteWithAuthorizationSignData = {
    domain: {
        name: string;
        version: string;
        chainId: number;
        verifyingContract: string;
    };
    types: {
        ExecuteWithAuthorization: {
            name: string;
            type: string;
        }[];
    };
    primaryType: string;
    message: {
        validAfter: number;
        validBefore: number;
        to: string | null | undefined;
        value: string;
        data: string;
    };
};

/**
 * ready: the user has not clicked on the button yet
 * pending: the user has clicked on the button and we're waiting for the transaction to be sent
 * waitingConfirmation: the transaction has been sent and we're waiting for the transaction to be confirmed by the chain
 * success: the transaction has been confirmed by the chain
 * error: the transaction has failed
 * unknown: the transaction receipt has failed to load
 */
export type TransactionStatus =
    | 'ready'
    | 'pending'
    | 'waitingConfirmation'
    | 'success'
    | 'error'
    | 'unknown';

export type TransactionStatusErrorType = {
    type:
        | 'SendTransactionError'
        | 'TxReceiptError'
        | 'RevertReasonError'
        | 'UserRejectedError';
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

export type PrivyAppInfo = {
    name: string;
    logo_url: string;
    description?: string;
};

export type SocialInfo = {
    code: string;
    name: string;
    logo_url: string;
    description?: string;
};

export type PrivyLoginMethod =
    | 'wallet'
    | 'email'
    | 'sms'
    | 'google'
    | 'twitter'
    | 'discord'
    | 'github'
    | 'linkedin'
    | 'spotify'
    | 'instagram'
    | 'tiktok'
    | 'apple'
    | 'farcaster'
    | 'telegram';
