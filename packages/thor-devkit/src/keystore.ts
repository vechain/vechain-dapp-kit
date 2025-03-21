import * as SecretStorage from '@vechain/ethers/utils/secret-storage'
import { Buffer } from 'buffer'

/** to present encrypted private key in Ethereum keystore format. */
export interface Keystore {
    address: string
    crypto: object
    id: string
    version: number
}

export namespace Keystore {
    /**
     * encrypt private key to keystore with given password
     * @param privateKey the private key to be encrypted
     * @param password password to encrypt the private key
     */
    export function encrypt(privateKey: Buffer, password: string) {
        return SecretStorage.encrypt(
            '0x' + privateKey.toString('hex'),
            password, {
            scrypt: {
                N: 131072,
                p: 1,
                r: 8
            }
        }).then(str => normalize(JSON.parse(str)))
    }

    /**
     * decrypt private key from keystore
     * an error thrown if not well formed
     * @param ks the keystore
     * @param password password to decrypt keystore
     */
    export function decrypt(ks: Keystore, password: string) {
        return SecretStorage.decrypt(JSON.stringify(ks), password)
            .then(sk => Buffer.from(sk.privateKey.slice(2), 'hex'))
    }

    /**
     * roughly check whether keystore is well formed
     * @param ks the keystore
     */
    export function wellFormed(ks: any): ks is Keystore {
        try {
            validate(normalize(ks))
            return true
        } catch {
            return false
        }
    }

    /** normalize keystore. e.g. lower case keys */
    function normalize(obj: object) {
        const lowerKey = (o: object) => {
            return Object.keys(o).reduce((converted, k) => {
                let v = (o as any)[k]
                if (typeof v === 'object') {
                    v = lowerKey(v)
                }
                converted[k.toLowerCase()] = v
                return converted
            }, {} as any)
        }
        return lowerKey(obj)
    }

    function validate(ks: Keystore) {
        if (ks.version !== 1 && ks.version !== 3) {
            throw new Error('unsupported version')
        }
        if (!/^[0-9a-f]{40}$/i.test(ks.address)) {
            throw new Error('invalid address')
        }
        if (!/^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/i.test(ks.id)) {
            throw new Error('invalid id')
        }
        if (typeof ks.crypto !== 'object') {
            throw new Error('invalid crypto')
        }
        return ks
    }
}
