import BigNumber from 'bignumber.js'
import * as rlp from 'rlp'
import { Buffer } from 'buffer'

export class RLP {
    constructor(readonly profile: RLP.Profile) { }

    /**
     * encode data according to profile
     * @param data the structured data to be encoded
     */
    public encode(data: any) {
        const packed = pack(data, this.profile, '')
        return rlp.encode(packed) as any as Buffer
    }

    /**
     * decode buffer according to profile
     * @param buf rlp encoded data
     */
    public decode(buf: Buffer) {
        const packed = rlp.decode(buf as any)
        return unpack(packed, this.profile, '')
    }
}

export namespace RLP {
    /** base class of scalar kind */
    export abstract class ScalarKind {
        public abstract data(data: any, ctx: string): { encode(): Buffer }
        public abstract buffer(buf: Buffer, ctx: string): { decode(): any }
    }

    /** a buffer kind to keep buffer type */
    export class BufferKind extends ScalarKind {
        public data(data: Buffer, ctx: string) {
            assert(Buffer.isBuffer(data), ctx, 'expected buffer')
            return { encode() { return data } }
        }
        public buffer(buf: Buffer, ctx: string) {
            return { decode() { return buf } }
        }
    }

    /** a scalar kind to presents number */
    export class NumericKind extends ScalarKind {
        /**
         * create a numeric kind
         * @param maxBytes up limit of data in bytes
         */
        constructor(readonly maxBytes?: number) {
            super()
        }

        public data(data: string | number, ctx: string) {
            assert(typeof data === 'string' || typeof data === 'number', ctx,
                'expected string or number')
            if (typeof data === 'string') {
                const isHex = isHexString(data)
                const isDec = isDecString(data)
                assert(isHex || isDec, ctx,
                    'expected non-negative integer in hex or dec string')
                if (isHex) {
                    assert(data.length > 2, ctx, 'expected valid hex string')
                }
            } else {
                assert(Number.isSafeInteger(data) && data >= 0, ctx,
                    'expected non-negative safe integer')
            }

            const bn = new BigNumber(data)
            if (bn.isZero()) {
                return {
                    encode() {
                        return Buffer.alloc(0)
                    }
                }
            }

            let hex = bn.toString(16)
            if (hex.length % 2 !== 0) {
                hex = '0' + hex
            }
            assert(this.maxBytes ? hex.length <= this.maxBytes * 2 : true, ctx,
                `expected number in ${this.maxBytes} bytes`)

            return {
                encode() {
                    return Buffer.from(hex, 'hex')
                }
            }
        }

        public buffer(buf: Buffer, ctx: string) {
            assert(this.maxBytes ? buf.length <= this.maxBytes : true, ctx,
                `expected less than ${this.maxBytes} bytes`)
            assert(buf.length === 0 || buf[0] !== 0, ctx,
                `expected canonical integer (no leading zero bytes)`)

            return {
                decode() {
                    if (buf.length === 0) {
                        return 0
                    }
                    const bn = new BigNumber(buf.toString('hex'), 16)
                    const num = bn.toNumber()
                    return Number.isSafeInteger(num) ? num : '0x' + bn.toString(16)
                }
            }
        }
    }

    /** a scalar kind to present blob */
    export class BlobKind<T = never> extends ScalarKind {
        public data(data: string, ctx: string) {
            assert(isHexString(data), ctx,
                'expected hex string')
            assert(data.length % 2 === 0, ctx,
                'expected even length hex')

            return {
                encode() {
                    return Buffer.from(data.slice(2), 'hex')
                }
            }
        }

        public buffer(buf: Buffer, ctx: string) {
            return {
                decode(): string | T {
                    return '0x' + buf.toString('hex')
                }
            }
        }
    }

    /** fixed length blob */
    export class FixedBlobKind<T = never> extends BlobKind<T> {
        constructor(readonly bytes: number) {
            super()
        }

        public data(data: string, ctx: string) {
            const encoder = super.data(data, ctx)
            assert(data.length === this.bytes * 2 + 2, ctx,
                `expected hex string presents ${this.bytes} bytes`)
            return encoder
        }

        public buffer(buf: Buffer, ctx: string) {
            const decoder = super.buffer(buf, ctx)
            assert(buf.length === this.bytes, ctx,
                `expected ${this.bytes} bytes`)
            return decoder
        }
    }

    /** fixed length blob allowing null */
    export class NullableFixedBlobKind extends FixedBlobKind<null> {
        public data(data: string | null, ctx: string) {
            if (!data) {
                return {
                    encode() {
                        return Buffer.alloc(0)
                    }
                }
            }
            return super.data(data, ctx)
        }

        public buffer(buf: Buffer, ctx: string) {
            if (buf.length === 0) {
                return { decode() { return null } }
            }
            return super.buffer(buf, ctx)
        }
    }

    /** fixed length blob kind that will remove leading zero on encoding and pad zero on decoding */
    export class CompactFixedBlobKind extends FixedBlobKind {
        public data(data: string, ctx: string) {
            const buf = super.data(data, ctx).encode()
            return {
                encode() {
                    const nzIndex = buf.findIndex(v => v !== 0)
                    if (nzIndex >= 0) {
                        return buf.slice(nzIndex)
                    }
                    return Buffer.alloc(0)
                }
            }
        }
        public buffer(buf: Buffer, ctx: string) {
            assert(buf.length <= this.bytes, ctx,
                `expected less than ${this.bytes} bytes`)

            assert(buf.length === 0 || buf[0] !== 0, ctx,
                `expected no leading zero bytes`)

            const bytes = this.bytes
            return {
                decode() {
                    const zeros = '0'.repeat((bytes - buf.length) * 2)
                    return '0x' + zeros + buf.toString('hex')
                }
            }
        }
    }

    /** a list of items in one kind */
    export interface ArrayKind { item: Profile['kind'] }
    /** a list of items in each kinds */
    export type StructKind = Profile[]

    /** presents a list item */
    export interface Profile {
        name: string
        kind: ScalarKind | ArrayKind | StructKind
    }
}

function pack(obj: any, profile: RLP.Profile, ctx: string): any {
    ctx = ctx ? ctx + '.' + profile.name : profile.name
    const kind = profile.kind
    if (kind instanceof RLP.ScalarKind) {
        return kind.data(obj, ctx).encode()
    }

    if (Array.isArray(kind)) {
        return kind.map(k => pack(obj[k.name], k, ctx))
    }

    assert(Array.isArray(obj), ctx,
        'expected array')
    const item = kind.item
    return (obj as any[]).map((part, i) => pack(part, { name: '#' + i, kind: item }, ctx))
}

function unpack(packed: any, profile: RLP.Profile, ctx: string): any {
    ctx = ctx ? ctx + '.' + profile.name : profile.name
    const kind = profile.kind
    if (kind instanceof RLP.ScalarKind) {
        assert(Buffer.isBuffer(packed), ctx,
            'expected Buffer')
        return kind.buffer(packed, ctx).decode()
    }

    if (Array.isArray(kind)) {
        assert(Array.isArray(packed), ctx,
            'expected array')
        const parts = packed as any[]
        assert(parts.length === kind.length, ctx,
            `expected ${kind.length} items, but got ${parts.length}`)
        return kind.reduce((o, p, i) => {
            o[p.name] = unpack(parts[i], p, ctx)
            return o
        }, {} as any)
    }

    assert(Array.isArray(packed), ctx,
        'expected array')
    const item = kind.item
    return (packed as any[]).map((part, i) => unpack(part, { name: '#' + i, kind: item }, ctx))
}

function assert(cond: boolean, ctx: string, msg: string) {
    if (!cond) {
        throw new RLPError(`${ctx}: ${msg}`)
    }
}

function isHexString(str: string) {
    return /^0x[0-9a-f]*$/i.test(str)
}

function isDecString(str: string) {
    return /^\d+$/.test(str)
}

class RLPError extends Error {
    constructor(msg: string) {
        super(msg)
        this.name = RLPError.name
    }
}
