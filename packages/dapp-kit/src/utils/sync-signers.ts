// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return */
import { blake2b256, secp256k1 } from '@vechain/sdk-core';
import type {
    BaseWallet,
    CertificateResponse,
    CertMessage,
    CertOptions,
    ExtendedClause,
    SendTxOptions,
    WalletTransactionResponse,
} from '../types';
import { GetGenesisBlockFunc } from '../types/types';

export type NewSignerFunc = (
    getGenesisBlock: GetGenesisBlockFunc,
) => Promise<BaseWallet>;

const BUDDY_SRC = 'https://unpkg.com/@vechain/connex-wallet-buddy@0.1';
const BUDDY_LIB_NAME = 'ConnexWalletBuddy';

const cache: Record<string, Promise<unknown>> = {};

const loadLibrary = <T>(src: string, libName: string): Promise<T> => {
    let lib = cache[src] as Promise<T> | undefined;
    if (!lib) {
        const script = document.createElement('script');
        lib = new Promise((resolve, reject) => {
            script.onload = () => resolve((window as never)[libName]);
            script.onerror = (err) => reject(new Error(err.toString()));
        });
        cache[src] = lib;
        script.src = src;
        document.body.appendChild(script);
    }
    return lib;
};

export const createSync2: NewSignerFunc = async (getGenesisBlock) => {
    const genesisBlock = await getGenesisBlock();
    return loadLibrary(BUDDY_SRC, BUDDY_LIB_NAME).then((lib: any) => {
        return lib.create(
            genesisBlock.id,
            Buffer.from(secp256k1.randomBytes(16))
                .toString('hex')
                .replace('0x', ''),
            (val: string | Uint8Array) =>
                blake2b256(val, 'hex').replace('0x', ''),
        );
    });
};

export const createSync: NewSignerFunc = async () => {
    const v1 = (window as Required<globalThis.Window>).connex.vendor;
    return Promise.resolve({
        signTx: (
            msg: ExtendedClause[],
            options: SendTxOptions = {},
        ): Promise<WalletTransactionResponse> => {
            const s1 = v1.sign('tx');
            options.signer && s1.signer(options.signer);
            options.gas && s1.gas(options.gas);
            options.dependsOn && s1.dependsOn(options.dependsOn);
            options.link && s1.link(options.link);
            options.comment && s1.link(options.comment);
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
            msg: CertMessage,
            options: CertOptions = {},
        ): Promise<CertificateResponse> => {
            const s1 = v1.sign('cert');
            options.signer && s1.signer(options.signer);
            options.link && s1.link(options.link);
            options.onAccepted?.();

            return s1.request(msg);
        },
    });
};
