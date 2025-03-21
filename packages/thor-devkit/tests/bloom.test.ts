import { expect } from 'chai'
import { Bloom } from '../src'
import { Buffer } from 'buffer'

describe('bloom', () => {
    it('estimate k', () => {
        expect(Bloom.estimateK(1)).equal(16)
        expect(Bloom.estimateK(100)).equal(14)
        expect(Bloom.estimateK(200)).equal(7)
        expect(Bloom.estimateK(300)).equal(5)
        expect(Bloom.estimateK(400)).equal(4)
        expect(Bloom.estimateK(500)).equal(3)
    })
    it('bloom add', () => {
        // Bloom filter with standard number of bites (definde in Bloom class)
        const bloomWithStandardNumberOfBites = new Bloom(14)

        // Bloom filter with user defined number of bites (2048 / 8 = 256)
        const bloomWithUserDefinedNumberOfBites = new Bloom(14, Buffer.alloc(Bloom.BITS_LENGTH / 8))

        bloomWithStandardNumberOfBites.add(Buffer.from('hello world', 'utf8'))
        bloomWithUserDefinedNumberOfBites.add(Buffer.from('hello world', 'utf8'))

        // Expect the same result because the number of bites is the same and the same data was added
        expect(bloomWithStandardNumberOfBites.bits.toString('hex')).equal('00000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000004000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000001000000000000020000000000000000000000000008000000000000000000000000000000080000000100000000000000000000040020000000000080000000000000000000080000000000000000000000000')
        expect(bloomWithUserDefinedNumberOfBites.bits.toString('hex')).equal('00000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000004000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000001000000000000020000000000000000000000000008000000000000000000000000000000080000000100000000000000000000040020000000000080000000000000000000080000000000000000000000000')

    })
    it('bloom test', () => {
        // Initialize bloom filter with 14 hash functions and add number from 0 to 99
        const b = new Bloom(14)
        for (let i = 0; i < 100; i++) {
            b.add(Buffer.from(i + '', 'utf8'))
        }

        // Positive case (number from 0 to 99 must be present in the bloom filter)
        for (let i = 0; i < 100; i++) {
            expect(b.test(Buffer.from(i + '', 'utf8'))).equal(true)
        }

        // Negative case (number from 100 must not be present in the bloom filter)
        expect(b.test(Buffer.from('100', 'utf8'))).equal(false)
    })
})
