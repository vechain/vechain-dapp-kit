import { expect } from 'chai'
import { blake2b256, keccak256, address, secp256k1, Keystore, mnemonic, HDNode } from '../src'

// tslint:disable:quotemark
// tslint:disable:object-literal-key-quotes
// tslint:disable:max-line-length
// tslint:disable:trailing-comma

describe('hash', () => {
    it('blake2b256', () => {
        expect(blake2b256(Buffer.alloc(0)).toString('hex')).equal('0e5751c026e543b2e8ab2eb06099daa1d1e5df47778f7787faab45cdf12fe3a8')
        expect(blake2b256('hello world').toString('hex')).equal('256c83b297114d201b30179f3f0ef0cace9783622da5974326b436178aeef610')
        expect(blake2b256('hello', ' world').toString('hex')).equal('256c83b297114d201b30179f3f0ef0cace9783622da5974326b436178aeef610')
    })

    it('keccak', () => {
        expect(keccak256(Buffer.alloc(0)).toString('hex')).equal('c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470')
        expect(keccak256('hello world').toString('hex')).equal('47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad')
        expect(keccak256('hello', ' world').toString('hex')).equal('47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad')
    })
})

describe('address.test', () => {
    it('validate address', () => {
        expect(address.test('not an address')).equal(false)
        expect(address.test('52908400098527886E0F7030069857D2E4169EE7')).equal(false)
        expect(address.test('0x52908400098527886E0F7030069857D2E4169EE7')).equal(true)
    })
})

describe('address.toChecksumed', () => {
    it('invalid input should throw error', () => {
        expect(() => { address.toChecksumed('invalid data') }).to.throw('invalid address')
        expect(() => { address.toChecksumed('52908400098527886E0F7030069857D2E4169EE7') }).to.throw('invalid address')
    })

    it('valid input', () => {
        expect(address.toChecksumed('0x8617E340B3D01FA5F11F306F4090FD50E238070D')).equal('0x8617E340B3D01FA5F11F306F4090FD50E238070D')
        expect(address.toChecksumed('0x8617E340B3D01FA5F11F306F4090FD50E238070D'.toLowerCase())).equal('0x8617E340B3D01FA5F11F306F4090FD50E238070D')
        expect(address.toChecksumed('0xde709f2102306220921060314715629080e2fb77')).equal('0xde709f2102306220921060314715629080e2fb77')
        expect(address.toChecksumed('0xde709f2102306220921060314715629080e2fb77'.toLowerCase())).equal('0xde709f2102306220921060314715629080e2fb77')
        expect(address.toChecksumed('0x27b1fdb04752bbc536007a920d24acb045561c26')).equal('0x27b1fdb04752bbc536007a920d24acb045561c26')
        expect(address.toChecksumed('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed')).equal('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed')
        expect(address.toChecksumed('0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359')).equal('0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359')
        expect(address.toChecksumed('0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB')).equal('0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB')
        expect(address.toChecksumed('0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb')).equal('0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb')
    })
})

describe('secp256k1', () => {
    const privKey = Buffer.from('7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a', 'hex')
    const pubKey = Buffer.from('04b90e9bb2617387eba4502c730de65a33878ef384a46f1096d86f2da19043304afa67d0ad09cf2bea0c6f2d1767a9e62a7a7ecc41facf18f2fa505d92243a658f', 'hex')
    const addr = '0xd989829d88b0ed1b06edf5c50174ecfa64f14a64'
    const msgHash = keccak256('hello world')
    const sig = Buffer.from('f8fe82c74f9e1f5bf443f8a7f8eb968140f554968fdcab0a6ffe904e451c8b9244be44bccb1feb34dd20d9d8943f8c131227e55861736907b02d32c06b934d7200', 'hex')
    
    const invalidPrivateKey = Buffer.from('INVALID_PRIVATE_KEY', 'hex')
    const invalidMessageHash = Buffer.from('INVALID_MESSAGE_HASH', 'hex')
    const invalidSignature = Buffer.from('INVALID_SIGNATURE', 'hex')
    const validSignatureWithWrongRecovery = Buffer.from('f8fe82c74f9e1f5bf443f8a7f8eb968140f554968fdcab0a6ffe904e451c8b9244be44bccb1feb34dd20d9d8943f8c131227e55861736907b02d32c06b934d72FF', 'hex')

    it('derive', () => {
        expect(secp256k1.derivePublicKey(privKey)).deep.equal(pubKey)
        expect(address.fromPublicKey(pubKey)).deep.equal(addr)

        // Invalid private key to derive public key
        expect(() => secp256k1.derivePublicKey(invalidPrivateKey)).to.throw(Error, 'invalid private key')
    })
    it('sign/recover', () => {
        expect(secp256k1.sign(msgHash, privKey)).deep.equal(sig)
        expect(secp256k1.recover(msgHash, sig)).deep.equal(pubKey)

        // Sign with invalid private key AND invalid message hash
        expect(() => secp256k1.sign(msgHash, invalidPrivateKey)).to.throw(Error, 'invalid private key')
        expect(() => secp256k1.sign(invalidMessageHash, privKey)).to.throw(Error, 'invalid message hash')

        // Recover with invalid message hash AND invalid signature AND invalid signature recovery
        expect(() => secp256k1.recover(invalidMessageHash, sig)).to.throw(Error, 'invalid message hash')
        expect(() => secp256k1.recover(msgHash, invalidSignature)).to.throw(Error, 'invalid signature')
        expect(() => secp256k1.recover(msgHash, validSignatureWithWrongRecovery)).to.throw(Error, 'invalid signature recovery')
    })
})

describe('keystore', () => {
    const privKey = secp256k1.generatePrivateKey()

    it('encrypt', async () => {
        const ks = await Keystore.encrypt(privKey, '123')
        expect(ks.version).equal(3)
        expect(ks.address).equal(address.fromPublicKey(secp256k1.derivePublicKey(privKey)).slice(2))
    })

    it('decrypt', async () => {
        const ks = await Keystore.encrypt(privKey, '123')
        const dprivKey = await Keystore.decrypt(ks, '123')
        expect(dprivKey).deep.equal(privKey)

        let fail
        try {
            await Keystore.decrypt(ks, 'wrong pass')
            fail = false
        } catch {
            fail = true
        }
        expect(fail).equal(true)
    })

    it('validate', async () => {
        const ks = await Keystore.encrypt(privKey, '123')
        expect(Keystore.wellFormed(ks)).equal(true)

        let cpy = { ...ks, version: 0 }
        expect(Keystore.wellFormed(cpy)).equal(false)

        cpy = { ...ks, address: 'not an address' }
        expect(Keystore.wellFormed(cpy)).equal(false)

        cpy = { ...ks, id: 'not an id' }
        expect(Keystore.wellFormed(cpy)).equal(false)

        cpy = { ...ks, crypto: 'not an object' as any }
        expect(Keystore.wellFormed(cpy)).equal(false)

        cpy = { ...ks };
        // tslint:disable-next-line:no-string-literal
        (cpy as any)['Crypto'] = cpy.crypto
        delete cpy.crypto
        expect(Keystore.wellFormed(cpy)).equal(true)

        cpy = { ...ks };
        // tslint:disable-next-line:no-string-literal
        (cpy.crypto as any)['Cipher'] = (cpy.crypto as any)['cipher']
        // tslint:disable-next-line:no-string-literal
        delete (cpy.crypto as any)['cipher']
        expect(Keystore.wellFormed(cpy)).equal(true)

        cpy = { ...ks }
        cpy.id = cpy.id.toUpperCase()
        expect(Keystore.wellFormed(cpy)).equal(true)
    })
})

describe('mnemonic', () => {
    const words = 'ignore empty bird silly journey junior ripple have guard waste between tenant'.split(' ')

    it('generate', () => {
        expect(mnemonic.generate().length).equal(12)
    })
    it('validate', () => {
        expect(mnemonic.validate(['hello', 'world'])).equal(false)
        expect(mnemonic.validate(mnemonic.generate())).equal(true)
    })
    it('derive', () => {
        expect(mnemonic.derivePrivateKey(words).toString('hex')).equal('27196338e7d0b5e7bf1be1c0327c53a244a18ef0b102976980e341500f492425')
    })
    it('hdNode', () => {
        const node = HDNode.fromMnemonic(words)
        const addresses = [
            '339fb3c438606519e2c75bbf531fb43a0f449a70',
            '5677099d06bc72f9da1113afa5e022feec424c8e',
            '86231b5cdcbfe751b9ddcd4bd981fc0a48afe921',
            'd6f184944335f26ea59dbb603e38e2d434220fcd',
            '2ac1a0aecd5c80fb5524348130ab7cf92670470a'
        ]
        for (let i = 0; i < 5; i++) {
            const child = node.derive(i)
            expect(address.fromPublicKey(child.publicKey).slice(2)).equal(addresses[i])
            expect(child.address).equal('0x' + addresses[i])
            expect(secp256k1.derivePublicKey(child.privateKey!).toString('hex')).equal(child.publicKey.toString('hex'))
        }

        const xprivNode = HDNode.fromPrivateKey(node.privateKey!, node.chainCode)
        for (let i = 0; i < 5; i++) {
            const child = xprivNode.derive(i)
            expect(address.fromPublicKey(child.publicKey).slice(2)).equal(addresses[i])
            expect(child.address).equal('0x' + addresses[i])
            expect(secp256k1.derivePublicKey(child.privateKey!).toString('hex')).equal(child.publicKey.toString('hex'))
        }

        const xpubNode = HDNode.fromPublicKey(node.publicKey, node.chainCode)
        for (let i = 0; i < 5; i++) {
            const child = xpubNode.derive(i)
            expect(address.fromPublicKey(child.publicKey).slice(2)).equal(addresses[i])
            expect(child.address).equal('0x' + addresses[i])
            expect(child.privateKey).equal(null)
        }

        // non-lowercase
        const node2 = HDNode.fromMnemonic(words.map(w => w.toUpperCase()))
        expect(node.address === node2.address)
    })

    it('hdNode custom path', () => {
        const eth_path = `m/44'/60'/0'/0`
        const node = HDNode.fromMnemonic(words, eth_path)
        // test case generated via https://iancoleman.io/bip39/
        const addresses = [
            '4473c83a6a9661ab9cdb6b07749998ad9e77a580',
            '858531457566df8b60cf1355b54e48e04e36be33',
            '40b5aa8b54aafaf6323b58ce5737ce320d92cf99',
            '988f3af24dca0a3080f9ab5a1f57d706c6b8f011',
            'ffb0e35ba82856f8f5b7a57104c38a73f3ceff03'
        ]
        for (let i = 0; i < 5; i++) {
            const child = node.derive(i)
            expect(address.fromPublicKey(child.publicKey).slice(2)).equal(addresses[i])
            expect(child.address).equal('0x' + addresses[i])
            expect(secp256k1.derivePublicKey(child.privateKey!).toString('hex')).equal(child.publicKey.toString('hex'))
        }
    })
})
