import * as R from './rules'

const MAX_LIMIT = 256

export function newFilter<T extends 'event' | 'transfer'>(
    readyDriver: Promise<Connex.Driver>,
    kind: T,
    criteria: Connex.Thor.Filter.Criteria<T>[]
): Connex.Thor.Filter<T> {

    const filterBody = {
        range: {
            unit: 'block',
            from: 0,
            to: 2 ** 32 - 1
        },
        options: {
            offset: 0,
            limit: 10
        },
        criteriaSet: criteria,
        order: 'asc'
    }

    let cacheHints: string[] | undefined

    return {
        range(range) {
            R.test(range, {
                unit: v => (v === 'block' || v === 'time') ? '' : `expected 'block' or 'time'`,
                from: R.uint64,
                to: R.uint64
            }, 'arg0')
            R.ensure(range.from <= range.to, 'arg0.from: expected <= arg0.to')

            filterBody.range = { ...range }
            return this
        },
        order(order) {
            R.ensure(order === 'asc' || order === 'desc',
                `arg0: expected 'asc' or 'desc'`)
            filterBody.order = order
            return this
        },
        cache(hints) {
            cacheHints = R.test(hints, [R.address], 'arg0').map(t => t.toLowerCase())
            return this
        },
        apply(offset, limit) {
            R.test(offset, R.uint64, 'arg0')
            R.ensure(limit >= 0 && limit <= MAX_LIMIT && Number.isInteger(limit),
                `arg1: expected unsigned integer <= ${MAX_LIMIT}`)

            filterBody.options.offset = offset
            filterBody.options.limit = limit

            if (kind === 'transfer') {
                return readyDriver.then<any>(d => d.filterTransferLogs(filterBody as any, cacheHints))
            } else {
                return readyDriver.then<any>(d => d.filterEventLogs(filterBody as any, cacheHints))
            }
        }
    }
}
