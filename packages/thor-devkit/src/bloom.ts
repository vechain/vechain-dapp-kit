import { blake2b256 } from './blake2b'
import { Buffer } from 'buffer'

/**
 * 2048 bits Bloom filter
 */
export class Bloom {
    /** number of hash functions */
    public static readonly MAX_K = 16
    /** bit length */
    public static readonly BITS_LENGTH = 2048

    /** estimate k(number of hash functions) according to item count */
    public static estimateK(itemCount: number) {
        const k = Math.round(this.BITS_LENGTH / itemCount * Math.LN2)
        return Math.max(Math.min(k, this.MAX_K), 1)
    }

    public readonly bits: Buffer
    public readonly k: number

    /**
     * new bloom filter instance
     * @param k number of hash functions
     * @param bits leave it out to construct an empty one
     */
    constructor(k: number, bits?: Buffer) {
        if (bits) {
            this.bits = bits
        } else {
            this.bits = Buffer.alloc(Bloom.BITS_LENGTH / 8)
        }
        this.k = k
    }

    /**
     * add item
     * @param item
     */
    public add(item: Buffer) {
        this.distribute(item, (index, bit) => {
            // tslint:disable-next-line:no-bitwise
            this.bits[index] |= bit
            return true
        })
    }

    /**
     * test if an item contained. (false positive)
     * @param item
     */
    public test(item: Buffer) {
        return this.distribute(item, (index, bit) => {
            // tslint:disable-next-line:no-bitwise
            return (this.bits[index] & bit) === bit
        })
    }

    private distribute(item: Buffer, cb: (index: number, bit: number) => boolean): boolean {
        const hash = blake2b256(item)
        for (let i = 0; i < this.k; i++) {
            // tslint:disable-next-line:no-bitwise
            const d = (hash[i * 2 + 1] + (hash[i * 2] << 8)) % Bloom.BITS_LENGTH
            // tslint:disable-next-line:no-bitwise
            const bit = 1 << (d % 8)
            if (!cb(Math.floor(d / 8), bit)) {
                return false
            }
        }
        return true
    }
}
