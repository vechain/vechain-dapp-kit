import { keccak256 } from './keccak'

/** address related utilities */
export namespace address {
    /**
     * derive Address from public key, note that the public key is uncompressed
     * @param pub the public key
     */
    export function fromPublicKey(pub: Buffer) {
        return '0x' + keccak256(pub.slice(1)).slice(12).toString('hex')
    }

    /**
     * to check if a value presents an address
     * @param v the value to be checked
     */
    export function test(v: any): v is string {
        return typeof v === 'string' && /^0x[0-9a-f]{40}$/i.test(v)
    }

    /**
     * encode the address to checksumed address that is compatible with eip-55
     * @param address input address
     */
    export function toChecksumed(addr: string) {
        if (!test(addr)) {
            throw new Error('invalid address')
        }
        addr = addr.slice(2).toLowerCase()
        const hash = keccak256(addr)

        let checksumed = '0x'
        for (let i = 0; i < addr.length; i++) {
            // tslint:disable-next-line:no-bitwise
            let byte = hash[i >> 1]
            if (i % 2 === 0) {
                // tslint:disable-next-line:no-bitwise
                byte >>= 4
            }

            if (byte % 16 >= 8) {
                checksumed += addr[i].toUpperCase()
            } else {
                checksumed += addr[i]
            }
        }
        return checksumed
    }
}
