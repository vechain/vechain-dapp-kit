import type { DriverNoVendor } from '@vechain/connex-driver';

export class FullDriver implements Connex.Driver {
    constructor(
        private readonly driver: DriverNoVendor,
        private signer: Connex.Signer,
    ) {}

    get genesis(): Connex.Thor.Block {
        return this.driver.genesis;
    }

    get head(): Connex.Thor.Status['head'] {
        return this.driver.head;
    }

    pollHead = (): Promise<Connex.Thor.Status['head']> =>
        this.driver.pollHead();

    getBlock = (revision: string | number): Promise<Connex.Thor.Block | null> =>
        this.driver.getBlock(revision);

    getTransaction = (
        id: string,
        allowPending: boolean,
    ): Promise<Connex.Thor.Transaction | null> =>
        this.driver.getTransaction(id, allowPending);

    getReceipt = (
        id: string,
    ): Promise<Connex.Thor.Transaction.Receipt | null> =>
        this.driver.getReceipt(id);

    getAccount = (
        addr: string,
        revision: string,
    ): Promise<Connex.Thor.Account> => this.driver.getAccount(addr, revision);

    getCode = (
        addr: string,
        revision: string,
    ): Promise<Connex.Thor.Account.Code> => this.driver.getCode(addr, revision);

    getStorage = (
        addr: string,
        key: string,
        revision: string,
    ): Promise<Connex.Thor.Account.Storage> =>
        this.driver.getStorage(addr, key, revision);

    explain = (
        arg: Connex.Driver.ExplainArg,
        revision: string,
        cacheHints?: string[],
    ): Promise<Connex.VM.Output[]> =>
        this.driver.explain(arg, revision, cacheHints);

    filterEventLogs = (
        arg: Connex.Driver.FilterEventLogsArg,
    ): Promise<Connex.Thor.Filter.Row<'event'>[]> =>
        this.driver.filterEventLogs(arg);

    filterTransferLogs = (
        arg: Connex.Driver.FilterTransferLogsArg,
    ): Promise<Connex.Thor.Filter.Row<'transfer'>[]> =>
        this.driver.filterTransferLogs(arg);

    signTx = async (
        msg: Connex.Vendor.TxMessage,
        options: Connex.Signer.TxOptions,
    ): Promise<Connex.Vendor.TxResponse> => this.signer.signTx(msg, options);

    signCert = async (
        msg: Connex.Vendor.CertMessage,
        options: Connex.Signer.CertOptions,
    ): Promise<Connex.Vendor.CertResponse> =>
        this.signer.signCert(msg, options);
}
