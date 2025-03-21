/* eslint-disable @typescript-eslint/no-unused-vars */
import { DriverNoVendor, SimpleNet } from '@vechain/connex-driver'
import { blake2b256 } from 'thor-devkit'
import { NewSignerFunc } from './signer'

/** the LazyDriver implements vendor methods at construction but allows attaching NoVendorDriver later to be a full one*/
export class LazyDriver implements Connex.Driver {
    private _driver: DriverNoVendor|null = null
    constructor(private readonly signer: Promise<Connex.Signer>) { }
    
    private get noVendor(): DriverNoVendor { 
        if (!this._driver) {
            throw new Error('thor driver is not ready')
        }
        return this._driver
    }
    setNoVendor(driver: DriverNoVendor):void {
        this._driver = driver
    }

    get genesis(): Connex.Thor.Block {
        return this.noVendor.genesis
    }
    get head(): Connex.Thor.Status['head'] {
        return this.noVendor.head
    }
    pollHead(): Promise<Connex.Thor.Status['head']> { 
        return this.noVendor.pollHead()
     }
    getBlock(revision: string | number): Promise<Connex.Thor.Block | null> {
        return this.noVendor.getBlock(revision)
    }
    getTransaction(id: string, allowPending: boolean): Promise<Connex.Thor.Transaction | null> { 
        return this.noVendor.getTransaction(id, allowPending)
     }
    getReceipt(id: string): Promise<Connex.Thor.Transaction.Receipt | null> { 
        return this.noVendor.getReceipt(id)
     }
    getAccount(addr: string, revision: string): Promise<Connex.Thor.Account> { 
        return this.noVendor.getAccount(addr, revision)
     }
    getCode(addr: string, revision: string): Promise<Connex.Thor.Account.Code> {
        return this.noVendor.getCode(addr, revision)
    }
    getStorage(addr: string, key: string, revision: string): Promise<Connex.Thor.Account.Storage> { 
        return this.noVendor.getStorage(addr, key, revision)
     }
    explain(arg: Connex.Driver.ExplainArg, revision: string, cacheHints?: string[]): Promise<Connex.VM.Output[]> { 
        return this.noVendor.explain(arg, revision, cacheHints)
     }
    filterEventLogs(arg: Connex.Driver.FilterEventLogsArg): Promise<Connex.Thor.Filter.Row<'event'>[]> { 
        return this.noVendor.filterEventLogs(arg)
     }
    filterTransferLogs(arg: Connex.Driver.FilterTransferLogsArg): Promise<Connex.Thor.Filter.Row<'transfer'>[]> { 
        return this.noVendor.filterTransferLogs(arg)
     }

    async signTx(msg: Connex.Vendor.TxMessage, options: Connex.Signer.TxOptions): Promise<Connex.Vendor.TxResponse> {
        return this.signer.then(b => b.signTx(msg, options))
    }
    async signCert(msg: Connex.Vendor.CertMessage, options: Connex.Signer.CertOptions): Promise<Connex.Vendor.CertResponse> {
        return this.signer.then(b => b.signCert(msg, options))
    }
}

const cache: Record<string, DriverNoVendor> = {}

/**
 * create a no vendor driver
 * @param node the url of thor node
 * @param genesis the enforced genesis block
 */
export function createNoVendor(node: string, genesis: Connex.Thor.Block): DriverNoVendor {
    const key = blake2b256(JSON.stringify({
        node,
        genesis
    })).toString('hex')

    let driver = cache[key]
    if (!driver) {
        cache[key] = driver = new DriverNoVendor(new SimpleNet(node), genesis)
    }
    return driver
}

/**
 * create a full driver
 * @param node the url of thor node
 * @param genesis the enforced genesis block
 * @param newSigner a function to create signer
 */
export function createFull(node: string, genesis: Connex.Thor.Block, newSigner: NewSignerFunc): Connex.Driver {
    const driver = new LazyDriver(newSigner(genesis.id))
    driver.setNoVendor(createNoVendor(node, genesis))

    return driver
}
