import { certificate } from '@vechain/sdk-core';
import type { BaseWallet, ConnectResponse, ConnexWallet } from '../types';
import { DEFAULT_CONNECT_CERT_MESSAGE } from '../constants';
import { ethers } from 'ethers';
import { SignTypedDataOptions } from '../types/types';

/**
 * A `ConnexWallet` for wallet's that use a certificate connection
 */
class CertificateBasedWallet implements ConnexWallet {
    constructor(
        private readonly wallet: BaseWallet,
        private readonly connectionCertificateData?: {
            message?: Connex.Vendor.CertMessage;
            options?: Connex.Signer.CertOptions;
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
    ): Promise<string> => {
        return this.wallet.signTypedData(_domain, _types, _value);
    };

    disconnect = async (): Promise<void> => this.wallet.disconnect?.();
}

export { CertificateBasedWallet };
