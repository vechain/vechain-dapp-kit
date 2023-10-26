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

    pollHead(): Promise<Connex.Thor.Status['head']> {
        return this.driver.pollHead();
    }

    getBlock(revision: string | number): Promise<Connex.Thor.Block | null> {
        return this.driver.getBlock(revision);
    }

    getTransaction(
        id: string,
        allowPending: boolean,
    ): Promise<Connex.Thor.Transaction | null> {
        return this.driver.getTransaction(id, allowPending);
    }

    getReceipt(id: string): Promise<Connex.Thor.Transaction.Receipt | null> {
        return this.driver.getReceipt(id);
    }

    getAccount(addr: string, revision: string): Promise<Connex.Thor.Account> {
        return this.driver.getAccount(addr, revision);
    }

    getCode(addr: string, revision: string): Promise<Connex.Thor.Account.Code> {
        return this.driver.getCode(addr, revision);
    }

    getStorage(
        addr: string,
        key: string,
        revision: string,
    ): Promise<Connex.Thor.Account.Storage> {
        return this.driver.getStorage(addr, key, revision);
    }

    explain(
        arg: Connex.Driver.ExplainArg,
        revision: string,
        cacheHints?: string[],
    ): Promise<Connex.VM.Output[]> {
        return this.driver.explain(arg, revision, cacheHints);
    }

    filterEventLogs(
        arg: Connex.Driver.FilterEventLogsArg,
    ): Promise<Connex.Thor.Filter.Row<'event'>[]> {
        return this.driver.filterEventLogs(arg);
    }

    filterTransferLogs(
        arg: Connex.Driver.FilterTransferLogsArg,
    ): Promise<Connex.Thor.Filter.Row<'transfer'>[]> {
        return this.driver.filterTransferLogs(arg);
    }

    async signTx(
        msg: Connex.Vendor.TxMessage,
        options: Connex.Signer.TxOptions,
    ): Promise<Connex.Vendor.TxResponse> {
        return this.signer.signTx(msg, options);
    }

    async signCert(
        msg: Connex.Vendor.CertMessage,
        options: Connex.Signer.CertOptions,
    ): Promise<Connex.Vendor.CertResponse> {
        return this.signer.signCert(msg, options);
    }
}
