import { Certificate } from 'thor-devkit';
import type { BaseWallet, ConnectResponse, ConnexWallet } from '../types';
import { DEFAULT_CONNECT_CERT_MESSAGE } from '../certificates';

/**
 * A `ConnexWallet` for wallet's that use a certificate connection
 */
export class CertificateConnectionWallet implements ConnexWallet {
    constructor(private readonly wallet: Promise<BaseWallet>) {}

    connect = async (): Promise<ConnectResponse> => {
        const cert = DEFAULT_CONNECT_CERT_MESSAGE;

        const {
            annex: { domain, signer, timestamp },
            signature,
        } = await this.signCert(cert, {});

        try {
            Certificate.verify({
                ...cert,
                signature,
                signer,
                domain,
                timestamp,
            });

            return {
                account: signer,
                verified: true,
            };
        } catch (e) {
            return {
                account: signer,
                verified: false,
            };
        }
    };

    signCert = (
        msg: Connex.Vendor.CertMessage,
        options: Connex.Signer.CertOptions,
    ): Promise<Connex.Vendor.CertResponse> =>
        this.wallet.then((w) => w.signCert(msg, options));

    signIn = (
        msg?: Connex.Vendor.CertMessage | undefined,
        options?: Connex.Signer.CertOptions | undefined,
    ): Promise<Connex.Vendor.CertResponse> => {
        const _msg = msg || DEFAULT_CONNECT_CERT_MESSAGE;
        const _options = options || {};

        return this.signCert(_msg, _options);
    };

    signTx = (
        msg: Connex.Vendor.TxMessage,
        options: Connex.Signer.TxOptions,
    ): Promise<Connex.Vendor.TxResponse> =>
        this.wallet.then((w) => w.signTx(msg, options));

    async disconnect(): Promise<void> {
        const _wallet = await this.wallet;

        return _wallet.disconnect?.() || Promise.resolve();
    }
}
