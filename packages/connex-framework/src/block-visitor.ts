export function newBlockVisitor(
    driver: Connex.Driver,
    revision: string | number
): Connex.Thor.Block.Visitor {

    return {
        get revision() { return revision },
        get: () => driver.getBlock(revision)
    }
}
