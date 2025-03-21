import { abi } from 'thor-devkit'
import { decodeRevertReason } from './revert-reason'
import { newFilter } from './filter'
import { newTxSigningService } from './vendor'
import * as R from './rules'

export function newAccountVisitor(
    readyDriver: Promise<Connex.Driver>,
    addr: string
): Connex.Thor.Account.Visitor {
    return {
        get address() { return addr },
        get: () => {
            return readyDriver.then(d => d.getAccount(addr, d.head.id))
        },
        getCode: () => {
            return readyDriver.then(d => d.getCode(addr, d.head.id))
        },
        getStorage: key => {
            key = R.test(key, R.bytes32, 'arg0').toLowerCase()
            return readyDriver.then(d => d.getStorage(addr, key, d.head.id))
        },
        method: jsonABI => {
            let coder
            try {
                coder = new abi.Function(JSON.parse(JSON.stringify(jsonABI)))
            } catch (err) {
                throw new R.BadParameter(`arg0: expected valid ABI (${err.message})`)
            }
            return newMethod(readyDriver, addr, coder)
        },
        event: jsonABI => {
            let coder
            try {
                coder = new abi.Event(JSON.parse(JSON.stringify(jsonABI)))
            } catch (err) {
                throw new R.BadParameter(`arg0: expected valid ABI (${err.message})`)
            }
            return newEvent(readyDriver, addr, coder)
        }
    }
}

function newMethod(
    readyDriver: Promise<Connex.Driver>,
    addr: string,
    coder: abi.Function
): Connex.Thor.Account.Method {

    let value: string | number = 0
    const opts: {
        caller?: string
        gas?: number
        gasPrice?: string
        gasPayer?: string
    } = {}

    let cacheHints: string[] | undefined

    return {
        value(val) {
            value = R.test(val, R.bigInt, 'arg0')
            return this
        },
        caller(addr) {
            opts.caller = R.test(addr, R.address, 'arg0').toLowerCase()
            return this
        },
        gas(gas) {
            opts.gas = R.test(gas, R.uint64, 'arg0')
            return this
        },
        gasPrice(gp) {
            opts.gasPrice = R.test(gp, R.bigInt, 'arg0').toString().toLowerCase()
            return this
        },
        gasPayer(addr: string) {
            opts.gasPayer = R.test(addr, R.address, 'arg0').toLowerCase()
            return this
        },
        cache(hints) {
            cacheHints = R.test(hints, [R.address], 'arg0').map(t => t.toLowerCase())
            return this
        },
        asClause: (...args) => {
            const inputsLen = (coder.definition.inputs || []).length
            R.ensure(inputsLen === args.length, `args count expected ${inputsLen}`)
            try {
                const data = coder.encode(...args)
                return {
                    to: addr,
                    value: value.toString().toLowerCase(),
                    data
                }
            } catch (err) {
                throw new R.BadParameter(`args can not be encoded (${err.message})`)
            }
        },
        call(...args) {
            const clause = this.asClause(...args)
            return readyDriver.then(d => d.explain(
                {
                    clauses: [clause as any],
                    ...opts
                },
                d.head.id,
                cacheHints
            ))
                .then(outputs => outputs[0])
                .then(output => {
                    if (output.reverted) {
                        const revertReason = decodeRevertReason(output.data)
                        return { ...output, revertReason, decoded: {} }
                    } else {
                        const decoded = coder.decode(output.data)
                        return { ...output, decoded }
                    }
                })
        },
        transact(...args) {
            const clause = this.asClause(...args)
            return newTxSigningService(readyDriver, [{...clause, abi: coder.definition}])
        }
    }
}

function newEvent(
    readyDriver: Promise<Connex.Driver>,
    addr: string,
    coder: abi.Event
): Connex.Thor.Account.Event {

    const encode = (indexed: object) => {
        const topics = coder.encode(indexed)
        return {
            address: addr,
            topic0: topics[0] || undefined,
            topic1: topics[1] || undefined,
            topic2: topics[2] || undefined,
            topic3: topics[3] || undefined,
            topic4: topics[4] || undefined
        }
    }

    return {
        asCriteria: indexed => {
            try {
                return encode(indexed)
            } catch (err) {
                throw new R.BadParameter(`arg0: can not be encoded (${err.message})`)
            }
        },
        filter: (indexed) => {
            R.test(indexed, [{}], 'arg0')

            if (indexed.length === 0) {
                indexed = [{}]
            }

            const criteria = indexed.map((o, i) => {
                try {
                    return encode(o)
                } catch (err) {
                    throw new R.BadParameter(`arg0.#${i}: can not be encoded (${err.message})`)
                }
            })
            const filter = newFilter(readyDriver, 'event', criteria)
            return {
                range(range: Connex.Thor.Filter.Range) {
                    filter.range(range)
                    return this
                },
                order(order) {
                    filter.order(order)
                    return this
                },
                cache(hints) {
                    filter.cache(hints)
                    return this
                },
                apply(offset: number, limit: number) {
                    return filter.apply(offset, limit)
                        .then(events => events.map(event => {
                            const decoded = coder.decode(event.data, event.topics)
                            return { ...event, decoded }
                        }))
                }
            }
        }
    }
}
