import { Thor } from '@vechain/connex-types';

export interface Signer {
    signTx(
        msg: Thor.Transaction,
        options?: { signer?: string },
    ): Promise<Thor.Transaction>;
    signCert(
        msg: Thor.Certificate,
        options?: { signer?: string },
    ): Promise<Thor.Certificate>;
}

export interface Driver extends Signer {
    readonly genesis: Thor.Block;
    /** current known head */
    readonly head: Thor.Status['head'];

    /**
     * poll new head
     * rejected only when driver closed
     */
    pollHead(): Promise<Thor.Status['head']>;

    getBlock(revision: string | number): Promise<Thor.Block | null>;
    getTransaction(
        id: string,
        allowPending?: boolean,
    ): Promise<Thor.Transaction | null>;
    getReceipt(id: string): Promise<Thor.Transaction.Receipt | null>;

    getAccount(addr: string, revision: string): Promise<Thor.Account>;
    getCode(addr: string, revision: string): Promise<Thor.Account.Code>;
    getStorage(
        addr: string,
        key: string,
        revision: string,
    ): Promise<Thor.Account.Storage>;

    explain(
        clauses: Thor.Transaction['clauses'],
        revision: string,
    ): Promise<Thor.VM.Output[]>;

    filterEventLogs(
        criteria: Thor.Filter.Criteria<'event'>,
    ): Promise<Thor.Filter.Row<'event'>[]>;
    filterTransferLogs(
        criteria: Thor.Filter.Criteria<'transfer'>,
    ): Promise<Thor.Filter.Row<'transfer'>[]>;
}

export {};
