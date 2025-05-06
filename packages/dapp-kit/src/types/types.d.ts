import type { LogLevel } from '../utils';
import { WalletConnectOptions } from './wc-types';
import type { CertificateData } from '@vechain/sdk-core';
import {
    CompressedBlockDetail,
    HttpClient,
    TypedDataDomain,
    TypedDataParameter,
    SignTypedDataOptions,
} from '@vechain/sdk-network';
import type {
    CertificateMessage,
    CertificateOptions,
    CertificateResponse,
    TransactionMessage,
    TransactionOptions,
    TransactionResponse,
} from './requests';

declare global {
    interface Window {
        vechain?: {
            newConnexSigner: (genesisId: string) => WalletSigner;
            isInAppBrowser?: boolean;
        };
        connex?: {
            vendor: {
                sign: (type: string) => any;
            };
        };
    }
}

type WalletSource = 'wallet-connect' | 'veworld' | 'sync' | 'sync2';

interface WalletConfig {
    requiresCertificate: boolean;
}

type Genesis = 'main' | 'test' | CompressedBlockDetail;

/**
 * Simple Certificate Args
 */
type CertificateArgs = {
    message: CertificateMessage;
    options?: CertificateOptions;
};

/**
 * Callback used by the DAppKit `connect` function
 */
type ConnectCallback = (
    _certificate?: CertificateArs,
) => Promise<ConnectResponse>;

/**
 * Options for the DAppKit class
 * @param node - The URL of the Node, or the {@link HttpClient} instance
 * @param onDisconnected - A callback that will be called when the session is disconnected
 * @param walletConnectOptions - Optional. Options for the WalletConnect integration
 * @param usePersistence - Optional. Whether to persist the wallet source/ account
 * @param useFirstDetectedSource - Optional. Whether to use the first detected wallet source. Defaults to false
 * @param logLevel - Optional. The log level to use for the DAppKitUI logger
 * @param requireCertificate - Optional. Whether to require a connection certificate. Defaults to true
 * @param connectionCertificate - Optional. Options for the connection certificate
 * @param allowedWallets - Optional. An array of wallet sources to allow. Defaults to all sources
 */
interface DAppKitOptions {
    node: string | HttpClient;
    walletConnectOptions?: WalletConnectOptions;
    usePersistence?: boolean;
    useFirstDetectedSource?: boolean;
    logLevel?: LogLevel;
    requireCertificate?: boolean;
    connectionCertificate?: CertificateArgs;
    allowedWallets?: WalletSource[];
}

interface WalletSigner {
    signTx: (
        msg: TransactionMessage[],
        options: TransactionOptions,
    ) => Promise<TransactionResponse>;
    signCert: (
        msg: CertificateMessage,
        options: CertificateOptions,
    ) => Promise<CertificateResponse>;
    signTypedData?: (
        domain: TypedDataDomain,
        types: Record<string, TypedDataParameter[]>,
        message: Record<string, unknown>,
        options?: SignTypedDataOptions,
    ) => Promise<string>;
}

/**
 * Modifies the WalletSigner interface to include a disconnect method
 */
type VeChainWallet = WalletSigner & {
    connect: ConnectCallback;
    disconnect?: () => void | Promise<void>;
};

interface ConnectResponse {
    account: string;
    verified: boolean;
    connectionCertificate?: CertificateData;
}

interface WalletManagerState {
    source: WalletSource | null;
    address: string | null;
    accountDomain: string | null;
    isAccountDomainLoading: boolean;
    availableSources: WalletSource[];
    connectionCertificate: CertificateData | null;
}

export type {
    CertificateArgs,
    ConnectCallback,
    DAppKitOptions,
    VeChainWallet,
    WalletConfig,
    WalletSource,
    WalletManagerState,
    ConnectResponse,
    DriverSignedTypedData,
    Genesis,
    SignTypedDataOptions,
    WalletSigner,
};
