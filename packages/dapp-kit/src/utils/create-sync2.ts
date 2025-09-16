import { create } from '@vechain/connex-wallet-buddy';
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

export type NewSignerFunc = (genesisID: string) => WalletSigner;

export const createSync2: NewSignerFunc = (genesisID) => {
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
    return create(genesisID, randomBytes, hashFunc);
};

export const createSync = () => {
    if (!window.connex) {
        throw new Error('Connex is not available');
    }
    const v1 = window.connex.vendor;
    return {
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
    };
};
