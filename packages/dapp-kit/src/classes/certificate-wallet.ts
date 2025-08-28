import { Certificate } from '@vechain/sdk-core';
import {
    SignTypedDataOptions,
    TypedDataDomain,
    TypedDataParameter,
} from '@vechain/sdk-network';
import { recoverTypedDataAddress } from 'viem';
import { DEFAULT_CONNECT_CERT_MESSAGE } from '../constants';
import type {
    CertificateArgs,
    ConnectResponse,
    ConnectV2Response,
    TypedDataMessage,
    VeChainWallet,
    WalletProvider,
    WalletSigner,
} from '../types';
import type {
    CertificateMessage,
    CertificateOptions,
    CertificateResponse,
    TransactionMessage,
    TransactionOptions,
    TransactionResponse,
} from '../types/requests';
import { getPrimaryType } from '../utils/typed-data';

/**
 * A `VechainWallet` for wallet's that use a certificate connection
 */
class CertificateBasedWallet implements VeChainWallet {
    private readonly certificateData: Required<CertificateArgs>;

    constructor(
        private readonly wallet: WalletSigner,
        private readonly walletProvider: WalletProvider | null,
        private readonly genesisId: string,
        connectionCertificateData?: CertificateArgs,
    ) {
        this.certificateData = {
            message:
                connectionCertificateData?.message ??
                DEFAULT_CONNECT_CERT_MESSAGE,
            options: connectionCertificateData?.options ?? {},
        };
    }

    switchWallet = async (): Promise<string | null> => {
        if (!this.walletProvider)
            throw new Error(
                'CertificateBasedWallet: switchWallet -> Switch wallet is not supported',
            );
        return this.walletProvider.send!({
            method: 'thor_switchWallet',
            genesisId: this.genesisId,
        });
    };

    connectV2 = async <
        TValue extends null | CertificateMessage | TypedDataMessage,
    >(
        value: TValue,
        external?: boolean,
    ): Promise<ConnectV2Response<TValue>> => {
        if (!this.walletProvider) {
            if (value === null)
                throw new Error(
                    'CertificateBasedWallet: newConnect -> Value is null and user cannot use the new method',
                );
            if ('purpose' in value) {
                const cert = await this.signCert(value, {});
                return cert as any;
            }
            const res = await this.signTypedData(
                value.domain,
                value.types,
                value.value,
            );
            const signer = await recoverTypedDataAddress({
                signature: res as `0x${string}`,
                message: value.value,
                domain: value.domain,
                types: value.types,
                primaryType: getPrimaryType(value.types),
            });
            return { signer, signature: res } as any;
        }
        return this.walletProvider.send!({
            method: 'thor_connect',
            genesisId: this.genesisId,
            params: {
                value: value,
                external,
            },
        }) as any;
    };
    getAvailableMethods = async (): Promise<string[] | null> => {
        if (!this.walletProvider) return null;
        try {
            return await this.walletProvider.send!({
                method: 'thor_methods',
                genesisId: this.genesisId,
            });
        } catch {
            return null;
        }
    };

    getAddress = async (): Promise<string | null> => {
        if (!this.walletProvider) return null;
        try {
            return await this.walletProvider.send!({
                method: 'thor_wallet',
                genesisId: this.genesisId,
            });
        } catch {
            return null;
        }
    };

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
    ): Promise<CertificateResponse> => this.wallet.signCert(msg, options);

    signTx = (
        msg: TransactionMessage[],
        options: TransactionOptions,
    ): Promise<TransactionResponse> => {
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

        return this.wallet.signTx(msg, options);
    };

    signTypedData = (
        domain: TypedDataDomain,
        types: Record<string, TypedDataParameter[]>,
        message: Record<string, unknown>,
        options?: SignTypedDataOptions,
    ): Promise<string> => {
        if (!this.wallet.signTypedData) {
            throw new Error('signTypedData is not implemented');
        }
        return this.wallet?.signTypedData(domain, types, message, options);
    };

    disconnect = async () => {
        const methods = await this.getAvailableMethods();
        if (
            !methods ||
            methods.length === 0 ||
            !methods.find((method) => method === 'thor_disconnect')
        )
            return;

        await this.walletProvider?.send?.({
            genesisId: this.genesisId,
            method: 'thor_disconnect',
        });
    };
}

export { CertificateBasedWallet };
