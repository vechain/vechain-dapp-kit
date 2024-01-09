import { Certificate } from 'thor-devkit';
import type { BaseWallet, ConnectResponse, ConnexWallet } from '../types';
import { DEFAULT_CONNECT_CERT_MESSAGE } from '../certificates';

/**
 * A `ConnexWallet` for wallet's that use a certificate connection
 */
class CertificateBasedWallet implements ConnexWallet {
    connectionCertificate: Connex.Vendor.CertMessage;
    constructor(private readonly wallet: BaseWallet) {
        this.connectionCertificate = DEFAULT_CONNECT_CERT_MESSAGE;
    }

    connect = async (): Promise<ConnectResponse> => {
        const {
            annex: { domain, signer, timestamp },
            signature,
        } = await this.signCert(this.connectionCertificate, {});

        try {
            Certificate.verify({
                ...this.connectionCertificate,
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
        this.wallet.signCert(msg, options);

    signTx = (
        msg: Connex.Vendor.TxMessage,
        options: Connex.Signer.TxOptions,
    ): Promise<Connex.Vendor.TxResponse> => this.wallet.signTx(msg, options);

    disconnect = async (): Promise<void> => this.wallet.disconnect?.();
}

export { CertificateBasedWallet };
