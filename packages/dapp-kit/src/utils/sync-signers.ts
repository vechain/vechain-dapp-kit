import { randomBytes } from 'crypto';
import {
    BaseWallet,
    CertificateResponse,
    CertMessage,
    CertOptions,
    ExtendedClause,
    SendTxOptions,
    SendTxResponse,
} from '../types';
import { blake2b256 } from '@vechain/sdk-core';

const BUDDY_SRC = 'https://unpkg.com/@vechain/connex-wallet-buddy@0.1';
const BUDDY_LIB_NAME = 'ConnexWalletBuddy';

export type NewSignerFunc = (genesisId: string) => Promise<BaseWallet>;

const cache: Record<string, Promise<unknown>> = {};

function loadLibrary<T>(src: string, libName: string): Promise<T> {
    let lib = cache[src] as Promise<T> | undefined;
    if (!lib) {
        const script = document.createElement('script');
        cache[src] = lib = new Promise((resolve, reject) => {
            script.onload = () => resolve((window as never)[libName]);
            script.onerror = (err) => reject(new Error(err.toString()));
        });
        script.src = src;
        document.body.appendChild(script);
    }
    console.log(lib);
    return lib;
}

export const createSync2: NewSignerFunc = async (genesisId: string) => {
    return loadLibrary(BUDDY_SRC, BUDDY_LIB_NAME).then((lib: any) => {
        return lib.create(
            genesisId,
            randomBytes(16).toString('hex').replace('0x', ''),
            (val: any) => blake2b256(val, 'hex').replace('0x', ''),
        );
    });
};

export const createSync: NewSignerFunc = async () => {
    // @ts-ignore
    const v1 = (window as Required<globalThis.Window>).connex.vendor;
    return Promise.resolve({
        signTx: (
            msg: ExtendedClause[],
            options: SendTxOptions,
        ): Promise<SendTxResponse> => {
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
            options.onAccepted && options.onAccepted();

            return s1.request(msg);
        },
        signCert: (
            msg: CertMessage,
            options: CertOptions,
        ): Promise<CertificateResponse> => {
            const s1 = v1.sign('cert');
            options.signer && s1.signer(options.signer);
            options.link && s1.link(options.link);
            options.onAccepted && options.onAccepted();

            return s1.request(msg);
        },
    });
};
