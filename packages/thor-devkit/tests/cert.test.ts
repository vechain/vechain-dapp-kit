import { expect } from 'chai'
import { Certificate, secp256k1, address, blake2b256 } from '../src'

describe('cert', () => {
    const privKey = Buffer.from('7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a', 'hex')
    const signer = address.fromPublicKey(secp256k1.derivePublicKey(privKey))
    const cert = {
        purpose: 'identification',
        payload: {
            type: 'text',
            content: 'fyi'
        },
        domain: 'localhost',
        timestamp: 1545035330,
        signer
    }
    const cert2 = {
        domain: 'localhost',
        timestamp: 1545035330,
        purpose: 'identification',
        signer,
        payload: {
            content: 'fyi',
            type: 'text'
        }
    }
    it('encode', () => {
        expect(Certificate.encode(cert)).equal(Certificate.encode(cert2))
        expect(Certificate.encode(cert)).equal(Certificate.encode({ ...cert, signer: cert.signer.toUpperCase() }))
        const sig = '0x' + secp256k1.sign(blake2b256(Certificate.encode(cert)), privKey).toString('hex')
        expect(Certificate.encode({ ...cert, signature: sig }))
            .equal(Certificate.encode({ ...cert, signature: sig.toUpperCase() }))
    })

    it('verify', () => {
        // Valid signature
        const sig = '0x' + secp256k1.sign(blake2b256(Certificate.encode(cert)), privKey).toString('hex')
        expect(() => Certificate.verify({ ...cert, signature: sig, signer: '0x' })).to.throw()
        expect(() => Certificate.verify({ ...cert, signature: sig })).not.to.throw()
        expect(() => Certificate.verify({ ...cert, signature: sig.toUpperCase() })).not.to.throw()

        // Invalid signature
        const invalidSignature = '0xBAD' + secp256k1.sign(blake2b256(Certificate.encode(cert)), privKey).toString('hex')
        expect(() => Certificate.verify({ ...cert, signature: invalidSignature, signer: '0x' })).to.throw()
        
        // No signature
        expect(() => Certificate.verify({ ...cert, signer: '0x' })).to.throw()
    })
})
