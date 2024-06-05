import { certificate } from '@vechain/sdk-core';
import type {
    BaseWallet,
    CertificateResponse,
    CertMessage,
    CertOptions,
    ConnectResponse,
    RemoteWallet,
    ExtendedClause,
    SendTxOptions,
    WalletTransactionResponse,
} from '../types';
import { DEFAULT_CONNECT_CERT_MESSAGE } from '../constants';

/**
 * A `RemoteWallet` for wallet's that use a certificate connection
 */
class CertificateBasedWallet implements RemoteWallet {
    constructor(
        private readonly wallet: Promise<BaseWallet>,
        private readonly connectionCertificateData?: {
            message?: CertMessage;
            options?: CertOptions;
        },
    ) {}

    connect = async (addr?: string): Promise<ConnectResponse> => {
        const certificateMessage =
            this.connectionCertificateData?.message ||
            DEFAULT_CONNECT_CERT_MESSAGE;
        const certificateOptions =
            this.connectionCertificateData?.options || {};
        if (addr) {
            certificateOptions.signer = addr;
        }

        const {
            annex: { domain, signer, timestamp },
            signature,
        } = await this.signCert(certificateMessage, certificateOptions);

        const connectionCertificate = {
            ...certificateMessage,
            signature,
            signer,
            domain,
            timestamp,
        };

        try {
            certificate.verify(connectionCertificate);

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
        msg: CertMessage,
        options: CertOptions = {},
    ): Promise<CertificateResponse> =>
        this.wallet.then((w) => w.signCert(msg, options));

    signTx = (
        msg: ExtendedClause[],
        options: SendTxOptions = {},
    ): Promise<WalletTransactionResponse> =>
        this.wallet.then((w) => w.signTx(msg, options));

    disconnect = (): Promise<void> => Promise.resolve();
}

export { CertificateBasedWallet };
