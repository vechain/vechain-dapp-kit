import  blake from 'blakejs'
import { Buffer } from 'buffer'

/**
 * computes blake2b 256bit hash of given data
 * @param data one or more Buffer | string
 */
export function blake2b256(...data: Array<Buffer | string>) {
    const ctx = blake.blake2bInit(32)
    data.forEach(d => {
        if (Buffer.isBuffer(d)) {
            blake.blake2bUpdate(ctx, d)
        } else {
            blake.blake2bUpdate(ctx, Buffer.from(d, 'utf8'))
        }
    })
    return Buffer.from(blake.blake2bFinal(ctx))
}
