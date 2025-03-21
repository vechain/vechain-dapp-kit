import { randomBytes } from 'crypto'
import { ec as EC } from 'elliptic'
import { Buffer } from 'buffer'

const curve = new EC('secp256k1')

const N = Buffer.from('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141', 'hex')
const ZERO = Buffer.alloc(32, 0)

function isValidPrivateKey(key: Buffer) {
    return Buffer.isBuffer(key) &&
        key.length === 32 &&
        !key.equals(ZERO) &&
        key.compare(N) < 0
}

function isValidMessageHash(hash: Buffer) {
    return Buffer.isBuffer(hash) && hash.length === 32
}

/** secp256k1 methods set */
export namespace secp256k1 {
    /**
     * generate private key
     * @param rng the optional random number generator, which exactly generates 32 random bytes
     */
    export function generatePrivateKey(rng?: () => Buffer) {
        rng = rng ?? (() => randomBytes(32))
        for (; ;) {
            const privKey = rng()
            if (isValidPrivateKey(privKey)) {
                return privKey
            }
        }
    }

    /**
     * derive public key(uncompressed) from private key
     * @param privKey the private key
     */
    export function derivePublicKey(privKey: Buffer) {
        if (!isValidPrivateKey(privKey)) {
            throw new Error('invalid private key')
        }
        const keyPair = curve.keyFromPrivate(privKey)
        return Buffer.from(keyPair.getPublic().encode('array', false) as any)
    }

    /**
     * sign a message using elliptic curve algorithm on the curve secp256k1
     * @param msgHash hash of message
     * @param privKey serialized private key
     */
    export function sign(msgHash: Buffer, privKey: Buffer) {
        if (!isValidMessageHash(msgHash)) {
            throw new Error('invalid message hash')
        }

        if (!isValidPrivateKey(privKey)) {
            throw new Error('invalid private key')
        }

        const keyPair = curve.keyFromPrivate(privKey)
        const sig = keyPair.sign(msgHash, { canonical: true })

        const r = Buffer.from(sig.r.toArray('be', 32))
        const s = Buffer.from(sig.s.toArray('be', 32))

        return Buffer.concat([r, s, Buffer.from([sig.recoveryParam!])])
    }

    /**
     * recovery signature to public key
     * @param msgHash hash of message
     * @param sig signature
     */
    export function recover(msgHash: Buffer, sig: Buffer) {
        if (!isValidMessageHash(msgHash)) {
            throw new Error('invalid message hash')
        }
        if (!Buffer.isBuffer(sig) || sig.length !== 65) {
            throw new Error('invalid signature')
        }
        const recovery = sig[64]
        if (recovery !== 0 && recovery !== 1) {
            throw new Error('invalid signature recovery')
        }

        const r = sig.slice(0, 32)
        const s = sig.slice(32, 64)

        return Buffer.from(curve.recoverPubKey(
            msgHash,
            { r, s },
            recovery
        ).encode('array', false))
    }
}
