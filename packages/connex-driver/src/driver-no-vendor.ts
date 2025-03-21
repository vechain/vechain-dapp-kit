import { Net } from './interfaces'
import { PromInt, InterruptedError } from './promint'
import { Cache } from './cache'
import { blake2b256 } from 'thor-devkit'
import { sleep } from './common'

/** class implements Connex.Driver leaves out Vendor related methods */
export class DriverNoVendor implements Connex.Driver {
    public head: Connex.Thor.Status['head']

    private headResolvers = [] as Array<() => void>
    private readonly int = new PromInt()
    private readonly cache = new Cache()
    // to merge concurrent identical remote requests
    private readonly pendingRequests: Record<string, Promise<any>> = {}

    constructor(
        protected readonly net: Net,
        readonly genesis: Connex.Thor.Block,
        initialHead?: Connex.Thor.Status['head']
    ) {
        if (initialHead) {
            this.head = initialHead
        } else {
            this.head = {
                id: genesis.id,
                number: genesis.number,
                timestamp: genesis.timestamp,
                parentID: genesis.parentID,
                txsFeatures: genesis.txsFeatures,
                gasLimit: genesis.gasLimit
            }
        }
        void this.headTrackerLoop()
    }

    // close the driver to prevent mem leak
    public close(): void {
        this.int.interrupt()
    }

    // implementations
    public pollHead(): Promise<Connex.Thor.Status['head']> {
        return this.int.wrap(
            new Promise<Connex.Thor.Status['head']>(resolve => {
                this.headResolvers.push(() => resolve(this.head))
            }))
    }

    public getBlock(revision: string | number): Promise<Connex.Thor.Block | null> {
        return this.cache.getBlock(revision, () =>
            this.httpGet(`blocks/${revision}`))
    }
    public getTransaction(id: string, allowPending: boolean): Promise<Connex.Thor.Transaction | null> {
        return this.cache.getTx(id, () => {
            const query: Record<string, string> = { head: this.head.id }
            if (allowPending) {
                query.pending = 'true'
            }
            return this.httpGet(`transactions/${id}`, query)
        })
    }
    public getReceipt(id: string): Promise<Connex.Thor.Transaction.Receipt | null> {
        return this.cache.getReceipt(id, () =>
            this.httpGet(`transactions/${id}/receipt`, { head: this.head.id }))
    }
    public getAccount(addr: string, revision: string): Promise<Connex.Thor.Account> {
        return this.cache.getAccount(addr, revision, () =>
            this.httpGet(`accounts/${addr}`, { revision }))
    }
    public getCode(addr: string, revision: string): Promise<Connex.Thor.Account.Code> {
        return this.cache.getTied(`code-${addr}`, revision, () =>
            this.httpGet(`accounts/${addr}/code`, { revision }))
    }
    public getStorage(addr: string, key: string, revision: string): Promise<Connex.Thor.Account.Storage> {
        return this.cache.getTied(`storage-${addr}-${key}`, revision, () =>
            this.httpGet(`accounts/${addr}/storage/${key}`, { revision }))
    }
    public explain(arg: Connex.Driver.ExplainArg, revision: string, cacheHints?: string[]): Promise<Connex.VM.Output[]> {
        const cacheKey = `explain-${blake2b256(JSON.stringify(arg)).toString('hex')}`
        return this.cache.getTied(cacheKey, revision, () =>
            this.httpPost('accounts/*', arg, { revision }), cacheHints)
    }
    public filterEventLogs(arg: Connex.Driver.FilterEventLogsArg, cacheHints?: string[]): Promise<Connex.Thor.Filter.Row<'event'>[]> {
        const cacheKey = `event-${blake2b256(JSON.stringify(arg)).toString('hex')}`
        return this.cache.getTied(cacheKey, this.head.id, () =>
            this.httpPost('logs/event', arg), cacheHints)
    }
    public filterTransferLogs(arg: Connex.Driver.FilterTransferLogsArg, cacheHints?: string[]): Promise<Connex.Thor.Filter.Row<'transfer'>[]> {
        const cacheKey = `transfer-${blake2b256(JSON.stringify(arg)).toString('hex')}`
        return this.cache.getTied(cacheKey, this.head.id, () =>
            this.httpPost('logs/transfer', arg), cacheHints)
    }
    public signTx(
        msg: Connex.Vendor.TxMessage,
        options: Connex.Signer.TxOptions
    ): Promise<Connex.Vendor.TxResponse> {
        throw new Error('signer not implemented')
    }
    public signCert(
        msg: Connex.Vendor.CertMessage,
        options: Connex.Signer.CertOptions
    ): Promise<Connex.Vendor.CertResponse> {
        throw new Error('signer not implemented')
    }
    //////
    protected mergeRequest(req: () => Promise<any>, ...keyParts: any[]) {
        const key = JSON.stringify(keyParts)
        const pending = this.pendingRequests[key]
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        if (pending) {
            return pending
        }
        return this.pendingRequests[key] = (async () => {
            try {
                return await req()
            } finally {
                delete this.pendingRequests[key]
            }
        })()
    }
    protected httpGet(path: string, query?: Record<string, string>) {
        return this.mergeRequest(
            () => {
                return this.net.http('GET', path, {
                    query,
                    validateResponseHeader: this.headerValidator
                })
            },
            path,
            query || '')
    }

    protected httpPost(path: string, body: any, query?: Record<string, string>) {
        return this.mergeRequest(
            () => {
                return this.net.http('POST', path, {
                    query,
                    body,
                    validateResponseHeader: this.headerValidator
                })
            },
            path,
            query || '',
            body || '')
    }

    private get headerValidator() {
        return (headers: Record<string, string>) => {
            const xgid = headers['x-genesis-id']
            if (xgid && xgid !== this.genesis.id) {
                throw new Error(`responded 'x-genesis-id' not matched`)
            }
        }
    }

    private emitNewHead() {
        const resolvers = this.headResolvers
        this.headResolvers = []
        resolvers.forEach(r => r())
    }

    private async headTrackerLoop() {
        for (; ;) {
            let attemptWs = false
            try {
                const best = await this.int.wrap<Connex.Thor.Block>(this.httpGet('blocks/best'))
                if (best.id !== this.head.id && best.number >= this.head.number) {
                    this.head = {
                        id: best.id,
                        number: best.number,
                        timestamp: best.timestamp,
                        parentID: best.parentID,
                        txsFeatures: best.txsFeatures,
                        gasLimit: best.gasLimit
                    }
                    this.cache.handleNewBlock(this.head, undefined, best)
                    this.emitNewHead()

                    if (Date.now() - this.head.timestamp * 1000 < 60 * 1000) {
                        // nearly synced
                        attemptWs = true
                    }
                }
            } catch (err) {
                if (err instanceof InterruptedError) {
                    break
                }
            }

            if (attemptWs) {
                try {
                    await this.trackWs()
                } catch (err) {
                    if (err instanceof InterruptedError) {
                        break
                    }
                }
            }
            try {
                await this.int.wrap(sleep(8 * 1000))
            } catch {
                break
            }
        }
    }

    private async trackWs() {
        const wsPath =
            `subscriptions/beat2?pos=${this.head.parentID}`

        const wsr = this.net.openWebSocketReader(wsPath)

        try {
            for (; ;) {
                const data = await this.int.wrap(wsr.read())
                const beat: Beat2 = JSON.parse(data)
                if (!beat.obsolete && beat.id !== this.head.id && beat.number >= this.head.number) {
                    this.head = {
                        id: beat.id,
                        number: beat.number,
                        timestamp: beat.timestamp,
                        parentID: beat.parentID,
                        txsFeatures: beat.txsFeatures,
                        gasLimit: beat.gasLimit
                    }
                    this.cache.handleNewBlock(this.head, { k: beat.k, bits: beat.bloom })
                    this.emitNewHead()
                }
            }
        } finally {
            wsr.close()
        }
    }
}

interface Beat2 {
    number: number
    id: string
    parentID: string
    timestamp: number
    gasLimit: number
    bloom: string
    k: number
    txsFeatures?: number
    obsolete: boolean
}
