import * as V from 'validator-ts'
import * as R from './rules'

export function newDriverGuard(
    driver: Connex.Driver,
    errHandler?: (err: Error) => void
): Connex.Driver {

    const test = <T>(obj: T, scheme: V.Scheme<T>, path: string) => {
        try {
            V.validate(obj, scheme, path)
        } catch (err) {
            if (errHandler) {
                errHandler(err)
            } else {
                // tslint:disable-next-line:no-console
                console.warn(`Connex-Driver[MALFORMED RESPONSE]: ${err.message}`)
            }
        }
        return obj
    }

    const genesis = test(driver.genesis, blockScheme, 'genesis')
    return {
        genesis,
        get head() {
            return test(driver.head, headScheme, 'head')
        },
        pollHead() {
            return driver.pollHead()
                .then(h => test(h, headScheme, 'getHead()'))
        },
        getBlock(revision) {
            return driver.getBlock(revision)
                .then(b => b ? test(b, blockScheme, 'getBlock()') : b)
        },
        getTransaction(id, allowPending) {
            return driver.getTransaction(id, allowPending)
                .then(tx => tx ? test(tx, txScheme, 'getTransaction()') : tx)
        },
        getReceipt(id) {
            return driver.getReceipt(id)
                .then(r => r ? test(r, receiptScheme, 'getReceipt()') : r)
        },
        getAccount(addr: string, revision: string) {
            return driver.getAccount(addr, revision)
                .then(a => test(a, {
                    balance: R.hexString,
                    energy: R.hexString,
                    hasCode: R.bool
                }, 'getAccount()'))
        },
        getCode(addr: string, revision: string) {
            return driver.getCode(addr, revision)
                .then(c => test(c, {
                    code: R.bytes
                }, 'getCode()'))
        },
        getStorage(addr: string, key: string, revision: string) {
            return driver.getStorage(addr, key, revision)
                .then(s => test(s, {
                    value: R.bytes32
                }, 'getStorage()'))
        },
        explain(arg, revision) {
            return driver.explain(arg, revision)
                .then(r => test(r, [vmOutputScheme], 'explain()'))
        },
        filterEventLogs(arg) {
            return driver.filterEventLogs(arg)
                .then(r => test(r, [eventWithMetaScheme], 'filterEventLogs()'))
        },
        filterTransferLogs(arg) {
            return driver.filterTransferLogs(arg)
                .then(r => test(r, [transferWithMetaScheme], 'filterTransferLogs()'))
        },
        signTx(msg, options) {
            return driver.signTx(msg, options)
                .then(r => test(r, {
                    txid: R.bytes32,
                    signer: R.address
                }, 'signTx()'))
        },
        signCert(msg, options) {
            return driver.signCert(msg, options)
                .then(r => test(r, {
                    annex: {
                        domain: R.string,
                        timestamp: R.uint64,
                        signer: R.address
                    },
                    signature: v => R.isHexBytes(v, 65) ? '' : 'expected 65 bytes'
                }, 'signCert()'))
        }
    }
}

const headScheme: V.Scheme<Connex.Thor.Status['head']> = {
    id: R.bytes32,
    number: R.uint32,
    timestamp: R.uint64,
    parentID: R.bytes32,
    txsFeatures: V.optional(R.uint32),
    gasLimit: R.uint64
}

const blockScheme: V.Scheme<Connex.Thor.Block> = {
    id: R.bytes32,
    number: R.uint32,
    size: R.uint32,
    parentID: R.bytes32,
    timestamp: R.uint64,
    gasLimit: R.uint64,
    beneficiary: R.address,
    gasUsed: R.uint64,
    totalScore: R.uint64,
    txsRoot: R.bytes32,
    txsFeatures: V.optional(R.uint32),
    stateRoot: R.bytes32,
    receiptsRoot: R.bytes32,
    signer: R.address,
    com: V.optional(R.bool),
    isFinalized: V.optional(R.bool),
    isTrunk: R.bool,
    transactions: [R.bytes32]
}

const txScheme: V.Scheme<Connex.Thor.Transaction> = {
    id: R.bytes32,
    chainTag: R.uint8,
    blockRef: R.bytes8,
    expiration: R.uint32,
    gasPriceCoef: R.uint8,
    gas: R.uint64,
    origin: R.address,
    delegator: V.nullable(V.optional(R.address)),
    nonce: R.hexString,
    dependsOn: V.nullable(R.bytes32),
    size: R.uint32,
    clauses: [{
        to: V.nullable(R.address),
        value: R.hexString,
        data: R.bytes
    }],
    meta: V.nullable({
        blockID: R.bytes32,
        blockNumber: R.uint32,
        blockTimestamp: R.uint64
    })
}

const logMetaScheme: V.Scheme<Connex.Thor.Filter.WithMeta['meta']> = {
    blockID: R.bytes32,
    blockNumber: R.uint32,
    blockTimestamp: R.uint64,
    txID: R.bytes32,
    txOrigin: R.address,
    clauseIndex: R.uint32
}

const eventScheme: V.Scheme<Connex.VM.Event> = {
    address: R.address,
    topics: [R.bytes32],
    data: R.bytes,
}
const eventWithMetaScheme: V.Scheme<Connex.Thor.Filter.Row<'event'>> = {
    ...eventScheme,
    meta: logMetaScheme
}

const transferScheme: V.Scheme<Connex.VM.Transfer> = {
    sender: R.address,
    recipient: R.address,
    amount: R.hexString,
}

const transferWithMetaScheme: V.Scheme<Connex.Thor.Filter.Row<'transfer'>> = {
    ...transferScheme,
    meta: logMetaScheme
}

const receiptScheme: V.Scheme<Connex.Thor.Transaction.Receipt> = {
    gasUsed: R.uint64,
    gasPayer: R.address,
    paid: R.hexString,
    reward: R.hexString,
    reverted: R.bool,
    outputs: [{
        contractAddress: V.nullable(R.address),
        events: [eventScheme],
        transfers: [transferScheme]
    }],
    meta: {
        blockID: R.bytes32,
        blockNumber: R.uint32,
        blockTimestamp: R.uint64,
        txID: R.bytes32,
        txOrigin: R.address
    }
}

const vmOutputScheme: V.Scheme<Connex.VM.Output> = {
    data: R.bytes,
    vmError: R.string,
    gasUsed: R.uint64,
    reverted: R.bool,
    revertReason: () => '',
    events: [{
        address: R.address,
        topics: [R.bytes32],
        data: R.bytes,
    }],
    transfers: [{
        sender: R.address,
        recipient: R.address,
        amount: R.hexString,
    }]
}
