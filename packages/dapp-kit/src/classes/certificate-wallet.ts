import { Certificate } from '@vechain/sdk-core';
import type { ConnectResponse, VeChainWallet } from '../types';
import { DEFAULT_CONNECT_CERT_MESSAGE } from '../constants';
import type {
    CertificateMessage,
    CertificateOptions,
    CertificateResponse,
    TransactionMessage,
    TransactionOptions,
    TransactionResponse,
} from '../types/requests';
import type { WalletSigner } from '../types/types';

/**
 * A `VechainWallet` for wallet's that use a certificate connection
 */
class CertificateBasedWallet implements VeChainWallet {
    constructor(
        private readonly wallet: Promise<WalletSigner>,
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
    ): Promise<CertificateResponse> =>
        this.wallet.then((w) => w.signCert(msg, options));

    signTx = (
        msg: TransactionMessage[],
        options: TransactionOptions,
    ): Promise<TransactionResponse> =>
        this.wallet.then((w) => {
            if (options.delegator?.url === '') {
                options.delegator = undefined;
            }

            if (options.gas === 0) {
                options.gas = undefined;
            }

            if (options.comment === '') {
                options.comment = undefined;
            }

            if (options.dependsOn === '') {
                options.dependsOn = undefined;
            }

            return w.signTx(msg, options);
        });

    disconnect = () => Promise.resolve();
}

export { CertificateBasedWallet };
