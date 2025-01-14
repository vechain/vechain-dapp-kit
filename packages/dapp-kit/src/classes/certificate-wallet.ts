import { Certificate } from '@vechain/sdk-core';
import { ethers } from 'ethers';
import { DEFAULT_CONNECT_CERT_MESSAGE } from '../constants';
import type {
    BaseWallet,
    CertificateArgs,
    ConnectResponse,
    ConnexWallet,
} from '../types';
import { SignTypedDataOptions } from '../types/types';

/**
 * A `ConnexWallet` for wallet's that use a certificate connection
 */
class CertificateBasedWallet implements ConnexWallet {
    private readonly certificateData: Required<CertificateArgs>;
    constructor(
        private readonly wallet: BaseWallet,
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
        msg: Connex.Vendor.CertMessage,
        options: Connex.Signer.CertOptions,
    ): Promise<Connex.Vendor.CertResponse> =>
        this.wallet.signCert(msg, options);

    signTx = (
        msg: Connex.Vendor.TxMessage,
        options: Connex.Signer.TxOptions,
    ): Promise<Connex.Vendor.TxResponse> => this.wallet.signTx(msg, options);

    signTypedData = (
        _domain: ethers.TypedDataDomain,
        _types: Record<string, ethers.TypedDataField[]>,
        _value: Record<string, unknown>,
        _options?: SignTypedDataOptions,
    ): Promise<string> =>
        this.wallet.signTypedData(_domain, _types, _value, _options);

    disconnect = async (): Promise<void> => this.wallet.disconnect?.();
}

export { CertificateBasedWallet };
