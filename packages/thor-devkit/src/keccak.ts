import { keccak_256 } from 'js-sha3'
import { Buffer } from 'buffer'
/**
 * computes keccak256 hash of given data
 * @param data one or more Buffer | string
 */
export function keccak256(...data: Array<Buffer | string>) {
    const h = keccak_256.create()
    data.forEach(d => {
        if (Buffer.isBuffer(d)) {
            h.update(d)
        } else {
            h.update(Buffer.from(d, 'utf8'))
        }
    })
    return Buffer.from(h.digest())
}
