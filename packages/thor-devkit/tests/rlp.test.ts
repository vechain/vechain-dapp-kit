import { expect } from 'chai'
import { RLP } from '../src'
// tslint:disable:quotemark
// tslint:disable:object-literal-key-quotes
// tslint:disable:max-line-length
// tslint:disable:trailing-comma

describe('rlp', () => {
    it('bufferKind', () => {
        const kind = new RLP.BufferKind()
        expect(kind.data(Buffer.from('ff', 'hex'), '').encode()).deep.equal(Buffer.from('ff', 'hex'))
        expect(kind.buffer(Buffer.from('ff', 'hex'), '').decode()).deep.equal(Buffer.from('ff', 'hex'))
    })
    it('blobKind encode', () => {
        const kind = new RLP.BlobKind()
        expect(kind.data('0x1234567890', '').encode().toString('hex'))
            .equal('1234567890')

        expect(() => { kind.data('0x1', '').encode() }, 'odd hex').to.throw()
        expect(() => { kind.data('0xxy', '').encode() }).to.throw()
        expect(() => { kind.data(1 as any, '').encode() }).to.throw()
    })

    it('blobKind decode', () => {
        const kind = new RLP.BlobKind()
        expect(kind.buffer(Buffer.from([1, 2, 3, 4, 5]), '').decode()).equal('0x0102030405')
    })

    it('numericKind encode', () => {
        const kind = new RLP.NumericKind(8)

        expect(kind.data('0x0', '').encode().toString('hex')).equal('')
        expect(kind.data('0x123', '').encode().toString('hex')).equal('0123')
        expect(kind.data('0', '').encode().toString('hex')).equal('')
        expect(kind.data('100', '').encode().toString('hex')).equal('64')
        expect(kind.data(0, '').encode().toString('hex')).equal('')
        expect(kind.data(0x123, '').encode().toString('hex')).equal('0123')

        expect(() => { kind.data('0x123z', '') }).to.throw()
        expect(() => { kind.data({} as any, '') }).to.throw()
        expect(() => { kind.data('0x', '') }).to.throw()
        expect(() => { kind.data(-1, '') }).to.throw()
        expect(() => { kind.data('0x12345678123456780', '') }, 'exceed max bytes').to.throw()
        expect(() => { kind.data(2 ** 64, '') }, 'unsafe integer').to.throw()
    })
    it('numericKind decode', () => {
        const kind = new RLP.NumericKind(8)
        expect(kind.buffer(Buffer.alloc(0), '').decode()).equal(0)
        expect(kind.buffer(Buffer.from([1, 2, 3]), '').decode()).equal(0x010203)
        expect(kind.buffer(Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]), '').decode()).equal('0x102030405060708')

        expect(() => { kind.buffer(Buffer.alloc(9, 1), '').decode() }, 'exceeds max bytes').to.throw()
        expect(() => { kind.buffer(Buffer.from([0, 1]), '').decode() }, 'with leading zero').to.throw()
    })

    it('fixed blobKind encode', () => {
        const kind = new RLP.FixedBlobKind(4)
        expect(kind.data('0x12345678', '').encode().toString('hex')).equal('12345678')

        expect(() => { kind.data('0x1234567z', '').encode() }).to.throw()
        expect(() => { kind.data('0x11', '').encode() }).to.throw()
        expect(() => { kind.data('0x1234567890', '').encode() }).to.throw()
        expect(() => { kind.data('0x1234567', 'odd hex').encode() }).to.throw()
        expect(() => { kind.data(1 as any, '').encode() }).to.throw()
        expect(() => { kind.data(null as any, '').encode() }).to.throw()
    })

    it('fixed blobKind decode', () => {
        const kind = new RLP.FixedBlobKind(4)
        expect(kind.buffer(Buffer.from([1, 2, 3, 4]), '').decode()).equal('0x01020304')

        expect(() => { kind.buffer(Buffer.alloc(2), '').decode() }).to.throw()
        expect(() => { kind.buffer(Buffer.alloc(0), '').decode() }).to.throw()
    })

    it('nullable fixed BlobKind encode', () => {
        const kind = new RLP.NullableFixedBlobKind(4)
        expect(kind.data(null, '').encode().toString('hex')).equal('')
        expect(kind.data('0x12345678', '').encode().toString('hex')).equal('12345678')

        expect(() => { kind.data('0x1234567z', '').encode() }).to.throw()
        expect(() => { kind.data('0x11', '').encode() }).to.throw()
        expect(() => { kind.data('0x1234567890', '').encode() }).to.throw()
        expect(() => { kind.data('0x1234567', 'odd hex').encode() }).to.throw()
        expect(() => { kind.data(1 as any, '').encode() }).to.throw()

        expect(() => { kind.data('0x', '').encode() }).to.throw()
    })

    it('nullable fixed BlobKind decode', () => {
        const kind = new RLP.NullableFixedBlobKind(4)
        expect(kind.buffer(Buffer.alloc(0), '').decode()).equal(null)
        expect(kind.buffer(Buffer.from([1, 2, 3, 4]), '').decode()).equal('0x01020304')

        expect(() => { kind.buffer(Buffer.alloc(2), '').decode() }).to.throw()
    })

    it('compact fixed blobKind encode', () => {
        const kind = new RLP.CompactFixedBlobKind(4)
        expect(kind.data('0x00112233', '').encode().toString('hex')).equal('112233')
    })

    it('compact fixed blobKind decode', () => {
        const kind = new RLP.CompactFixedBlobKind(4)
        expect(kind.buffer(Buffer.from([1]), '').decode()).equal('0x00000001')
    })
    it('compact fixed encode with all zero string', () => {
        const kind = new RLP.CompactFixedBlobKind(4)
        expect(kind.data('0x00000000', '').encode().toString('hex')).equal('')
    })


    const profile: RLP.Profile = {
        name: '',
        kind: [
            { name: 'foo', kind: new RLP.NumericKind() },
            { name: 'bar', kind: new RLP.FixedBlobKind(4) },
            {
                name: 'baz', kind: {
                    item: [
                        { name: 'x', kind: new RLP.BlobKind() },
                        { name: 'y', kind: new RLP.NumericKind() },
                    ]
                }
            }
        ]
    }

    const data = {
        foo: 123,
        bar: '0x12345678',
        baz: [
            { x: '0x11', y: 1234 },
            { x: '0x12', y: 5678 }
        ]
    }

    it('encode', () => {
        const buf = new RLP(profile).encode(data)
        expect(buf.toString('hex')).equal('d17b8412345678cac4118204d2c41282162e')
    })

    it('decode', () => {
        const dec = new RLP(profile).decode(Buffer.from('d17b8412345678cac4118204d2c41282162e', 'hex'))
        expect(dec).deep.equal(data)
    })
})
