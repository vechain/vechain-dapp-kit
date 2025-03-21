export function newTxVisitor(
    readyDriver: Promise<Connex.Driver>,
    id: string
): Connex.Thor.Transaction.Visitor {
    let allowPending = false
    return {
        get id() {
            return id
        },
        allowPending() {
            allowPending = true
            return this
        },
        get: () => readyDriver.then(d => d.getTransaction(id, allowPending)),
        getReceipt: () => readyDriver.then(d => d.getReceipt(id))
    }
}
