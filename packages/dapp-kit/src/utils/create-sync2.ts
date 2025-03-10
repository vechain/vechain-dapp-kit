/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return */
import { Blake2b256, Secp256k1 } from '@vechain/sdk-core';
import type {
    CertificateMessage,
    CertificateOptions,
    CertificateResponse,
    TransactionMessage,
    TransactionOptions,
    TransactionResponse,
} from '../types';
import type { WalletSigner } from '../types/types';

export type NewSignerFunc = (
    genesisID: Promise<string>,
) => Promise<WalletSigner>;

const BUDDY_SRC = 'https://unpkg.com/@vechain/connex-wallet-buddy@0.1';
const BUDDY_LIB_NAME = 'ConnexWalletBuddy';

const cache: Record<string, Promise<unknown> | undefined> = {};

const loadLibrary = <T>(src: string, libName: string): Promise<T> => {
    if (!cache[src]) {
        const script = document.createElement('script');
        const lib = new Promise((resolve, reject) => {
            script.onload = () => resolve((window as never)[libName]);
            script.onerror = (err) => reject(new Error(err.toString()));
        });
        cache[src] = lib;
        script.src = src;
        document.body.appendChild(script);
    }
    return cache[src] as Promise<T>;
};

export const createSync2: NewSignerFunc = async (genesisID) => {
    const genesis = await genesisID;
    return loadLibrary(BUDDY_SRC, BUDDY_LIB_NAME).then((lib: any) => {
        const randomBytes = () =>
            Buffer.from(Secp256k1.randomBytes(16))
                .toString('hex')
                .replace('0x', '');
        const encoder = new TextEncoder();
        const hashFunc = (val: string | Uint8Array) => {
            let data: Uint8Array;
            if (typeof val === 'string') {
                data = encoder.encode(val);
            } else {
                data = val;
            }
            return Blake2b256.of(data).toString().replace('0x', '');
        };
        return lib.create(genesis, randomBytes, hashFunc);
    });
};

export const createSync: NewSignerFunc = async () => {
    if (!window.connex) {
        throw new Error('Connex is not available');
    }
    const v1 = window.connex.vendor;
    return Promise.resolve({
        signTx: (
            msg: TransactionMessage[],
            options: TransactionOptions = {},
        ): Promise<TransactionResponse> => {
            const s1 = v1.sign('tx');
            /*options.signer && s1.signer(options.signer);
            options.gas && s1.gas(options.gas);
            options.dependsOn && s1.dependsOn(options.dependsOn);
            options.link && s1.link(options.link);
            options.comment && s1.link(options.comment);*/
            if (options.delegator) {
                const url = options.delegator.url;
                s1.delegate(async (unsignedTx: any) => {
                    const res = await fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(unsignedTx),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    return res.json();
                });
            }
            options.onAccepted?.();

            return s1.request(msg);
        },
        signCert: (
            msg: CertificateMessage,
            options: CertificateOptions = {},
        ): Promise<CertificateResponse> => {
            const s1 = v1.sign('cert');
            /*options.signer && s1.signer(options.signer);
            options.link && s1.link(options.link);*/
            options.onAccepted?.();

            return s1.request(msg);
        },
    });
};
