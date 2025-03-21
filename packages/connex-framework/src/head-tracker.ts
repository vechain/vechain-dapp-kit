// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const checkpointInterval = 180

export function newHeadTracker(driver: Connex.Driver) {
    let head = { ...driver.head }
    let finalized = driver.genesis.id
    let resolvers: Array<(head: Connex.Thor.Status['head']) => void> = [];

    void (async () => {
        for (; ;) {
            try {
                const newHead = await driver.pollHead()
                if (newHead.id !== head.id && newHead.number >= head.number) {
                    if (head.number === 0 || (newHead.number + 1) % checkpointInterval === 0) {
                        try {
                            const finalizedBlk = await driver.getBlock('finalized')
                            if (finalizedBlk && finalizedBlk.id != finalized) {
                                finalized = finalizedBlk.id
                            }
                        } catch { void 0 }
                    }
                    head = { ...newHead }
                    const resolversCopy = resolvers
                    resolvers = []
                    resolversCopy.forEach(r => r(newHead))
                } else {
                    await new Promise(resolve => setTimeout(resolve, 1 * 1000))
                }
            } catch {
                // rejection from driver.getHead means driver closed
                break
            }
        }
    })()

    const genesisTs = driver.genesis.timestamp

    return {
        get head() { return head },
        get progress() {
            const nowTsMs = Date.now()
            const headTsMs = head.timestamp * 1000
            if (nowTsMs - headTsMs < 30 * 1000) {
                return 1
            }
            const genesisTsMs = genesisTs * 1000
            const p = (headTsMs - genesisTsMs) / (nowTsMs - genesisTsMs)
            return p < 0 ? NaN : p
        },
        get finalized() { return finalized },
        ticker: () => {
            let lastHeadId = head.id
            return {
                next: () => {
                    return new Promise<Connex.Thor.Status['head']>(resolve => {
                        if (lastHeadId !== head.id) {
                            return resolve({ ...head })
                        }
                        resolvers.push(newHead => {
                            resolve({ ...newHead })
                        })
                    }).then(h => {
                        lastHeadId = h.id
                        return h
                    })
                }
            }
        }
    }
}
