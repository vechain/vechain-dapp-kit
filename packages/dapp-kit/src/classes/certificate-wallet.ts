import { Certificate } from '@vechain/sdk-core';
import type { CertificateArgs, ConnectResponse, VeChainWallet } from '../types';
import { DEFAULT_CONNECT_CERT_MESSAGE } from '../constants';
import type {
    CertificateMessage,
    CertificateOptions,
    CertificateResponse,
    TransactionMessage,
    TransactionOptions,
    TransactionResponse,
} from '../types/requests';
import type { WalletSigner } from '../types';
import {
    SignTypedDataOptions,
    TypedDataDomain,
    TypedDataParameter,
} from '@vechain/sdk-network';

/**
 * A `VechainWallet` for wallet's that use a certificate connection
 */
class CertificateBasedWallet implements VeChainWallet {
    private readonly certificateData: Required<CertificateArgs>;

    constructor(
        private readonly wallet: Promise<WalletSigner>,
        connectionCertificateData?: CertificateArgs,
    ) {
        this.certificateData = {
            message:
                connectionCertificateData?.message ??
                DEFAULT_CONNECT_CERT_MESSAGE,
            options: connectionCertificateData?.options ?? {},
        };
    }

    connect = async (
        _certificate?: CertificateArgs,
    ): Promise<ConnectResponse> => {
        const certificateMessage =
            _certificate?.message || this.certificateData.message;
        const certificateOptions =
            _certificate?.options ?? this.certificateData.options;
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
            console.error('Failed to verify connection certificate', e);
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

    signTypedData = (
        domain: TypedDataDomain,
        types: Record<string, TypedDataParameter[]>,
        message: Record<string, unknown>,
        options?: SignTypedDataOptions,
    ): Promise<string> =>
        this.wallet.then((wallet) => {
            if (!wallet.signTypedData) {
                throw new Error('signTypedData is not implemented');
            }
            return wallet?.signTypedData(domain, types, message, options);
        });

    disconnect = () => Promise.resolve();
}

export { CertificateBasedWallet };
