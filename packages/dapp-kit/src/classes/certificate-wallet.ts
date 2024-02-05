import * as ThorDevkit from 'thor-devkit';
import type { BaseWallet, ConnectResponse, ConnexWallet } from '../types';
import { DEFAULT_CONNECT_CERT_MESSAGE } from '../constants';

/**
 * A `ConnexWallet` for wallet's that use a certificate connection
 */
class CertificateBasedWallet implements ConnexWallet {
    constructor(private readonly wallet: BaseWallet) {}

    connect = async (): Promise<ConnectResponse> => {
        const cert = DEFAULT_CONNECT_CERT_MESSAGE;
        const {
            annex: { domain, signer, timestamp },
            signature,
        } = await this.signCert(cert, {});

        const connectionCertificate = {
            ...cert,
            signature,
            signer,
            domain,
            timestamp,
        };

        try {
            ThorDevkit.Certificate.verify(connectionCertificate);

            return {
                account: signer,
                verified: true,
                connectionCertificate,
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
