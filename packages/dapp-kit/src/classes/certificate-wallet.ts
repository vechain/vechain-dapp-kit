import { Certificate } from '@vechain/sdk-core';
import type { BaseWallet, ConnectResponse, VechainWallet } from '../types';
import { DEFAULT_CONNECT_CERT_MESSAGE } from '../constants';
import type {
    CertificateMessage,
    CertificateOptions,
    CertificateResponse,
    TransactionMessage,
    TransactionOptions,
    TransactionResponse,
} from '../types/requests';

/**
 * A `VechainWallet` for wallet's that use a certificate connection
 */
class CertificateBasedWallet implements VechainWallet {
    constructor(
        private readonly wallet: BaseWallet,
        private readonly connectionCertificateData?: {
            message?: CertificateMessage;
            options?: CertificateOptions;
        },
    ) {}

    connect = async (): Promise<ConnectResponse> => {
        const certificateMessage =
            this.connectionCertificateData?.message ||
            DEFAULT_CONNECT_CERT_MESSAGE;
        const certificateOptions =
            this.connectionCertificateData?.options || {};
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
            Certificate.of(connectionCertificate).verify();

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
        msg: CertificateMessage,
        options: CertificateOptions,
    ): Promise<CertificateResponse> => this.wallet.signCert(msg, options);

    signTx = (
        msg: TransactionMessage[],
        options: TransactionOptions,
    ): Promise<TransactionResponse> => this.wallet.signTx(msg, options);

    disconnect = async (): Promise<void> => this.wallet.disconnect?.();
}

export { CertificateBasedWallet };
