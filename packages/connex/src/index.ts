import { Framework, newVendor } from '@vechain/connex-framework'
import { genesisBlocks } from './config'
import { createFull, createNoVendor, LazyDriver } from './driver'
import { Connex1, createSync, createSync2 } from './signer'

declare global {
    interface Window {
        /* connex@1.x, injected by Sync@1, VeChainThor mobile wallet*/
        connex?: Connex1;
    }
}

/** convert options.network to Connex.Thor.Block */
function normalizeNetwork(n: Options['network']) {
    n = n || 'main'
    if (typeof n === 'string') {
        const gb = genesisBlocks[n]
        if (!gb) {
            throw new Error('invalid network')
        }
        return gb
    } else {
        return n
    }
}

/** convert network name to genesis id */
function normalizeGenesisId(id?: 'main' | 'test' | string) {
    id = id || 'main'
    if (/^0x[0-9a-f]{64}$/.test(id)) {
        return id
    }
    const gb = genesisBlocks[id as 'main' | 'test']
    if (gb) {
        return gb.id
    }
    throw new Error('invalid genesis id')
}

/** convert options.signer to a signer creation function */
function normalizeSigner(genesisId: string, signer: BuiltinSigner) {
    switch (signer.toLocaleLowerCase()) {
        case 'sync':
            if (!window.connex) {
                throw new Error('Sync not found')
            }
            if (window.connex.thor.genesis.id !== genesisId) {
                throw new Error('Network mismatch')
            }
            return createSync
        case 'sync2':
            return createSync2
        default:
            throw new Error('unsupported signer')
    }
}

export type BuiltinSigner = 'sync' | 'sync2'

/** options for creating Connex object */
export type Options = {
    /** the base url of the thor node's thorREST API */
    node: string
    /**
     * the expected network of the node url. defaults to 'main' if omitted.
     * if it does not match with the actual network of the node url points to,
     * all subsequent request will fail.
     */
    network?: 'main' | 'test' | Connex.Thor.Block
    /** 
     * designated wallet to connect, Sync, Sync2 or VeWorldExtension supported, Sync2 if omitted.
     */
    signer? : BuiltinSigner
}

/** Thor class which can work stand alone to provide reading-services only */
class ThorClass implements Connex.Thor {
    genesis !: Connex.Thor['genesis']
    status !: Connex.Thor['status']
    ticker !: Connex.Thor['ticker']
    account !: Connex.Thor['account']
    block !: Connex.Thor['block']
    transaction !: Connex.Thor['transaction']
    filter !: Connex.Thor['filter']
    explain !: Connex.Thor['explain']

    constructor(opts: Omit<Options, 'signer'>) {
        const genesis = normalizeNetwork(opts.network)

        const driver = createNoVendor(opts.node, genesis)
        const framework = new Framework(driver)

        return {
            get genesis() { return framework.thor.genesis },
            get status() { return framework.thor.status },
            get ticker() { return framework.thor.ticker.bind(framework.thor) },
            get account() { return framework.thor.account.bind(framework.thor) },
            get block() { return framework.thor.block.bind(framework.thor) },
            get transaction() { return framework.thor.transaction.bind(framework.thor) },
            get filter() { return framework.thor.filter.bind(framework.thor) },
            get explain() { return framework.thor.explain.bind(framework.thor) }
        }
    }
}

/** Vendor class which can work standalone to provides signing-services only */
class VendorClass implements Connex.Vendor {
    sign !: Connex.Vendor['sign']
    constructor(genesisId: 'main' | 'test' | string, signer: BuiltinSigner = 'sync2') {
        genesisId = normalizeGenesisId(genesisId)
        const newSigner = normalizeSigner(genesisId,signer)

        const driver = new LazyDriver(newSigner(genesisId))
        const vendor = newVendor(driver)
        
        return {
            get sign() {
                return vendor.sign.bind(vendor)
            }
        }
    }
}

/** Connex class */
class ConnexClass implements Connex {
    static readonly Thor = ThorClass
    static readonly Vendor = VendorClass

    thor!: Connex.Thor
    vendor!: Connex.Vendor

    constructor(opts: Options) {
        const genesis = normalizeNetwork(opts.network)
        const newSigner = normalizeSigner(genesis.id, opts.signer??'sync2')

        const driver = createFull(opts.node, genesis, newSigner)
        const framework = new Framework(driver)
        return {
            get thor() { return framework.thor },
            get vendor() { return framework.vendor }
        }
    }
}

export default ConnexClass
export { ConnexClass as Connex }
