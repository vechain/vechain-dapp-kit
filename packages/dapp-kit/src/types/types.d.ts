import type { CertificateData } from '@vechain/sdk-core';
import {
    CompressedBlockDetail,
    HttpClient,
    SignTypedDataOptions,
    TypedDataDomain,
    TypedDataParameter,
} from '@vechain/sdk-network';
import type { LogLevel } from '../utils';
import type {
    CertificateMessage,
    CertificateOptions,
    CertificateResponse,
    TransactionMessage,
    TransactionOptions,
    TransactionResponse,
} from './requests';
import { WalletConnectOptions } from './wc-types';

declare global {
    interface Window {
        vechain?: {
            newConnexSigner: (genesisId: string) => WalletSigner;
            isInAppBrowser?: boolean;
        } & WalletProvider;
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
 */
interface DAppKitOptions {
    /**
     * The URL of the Node, or the {@link HttpClient} instance
     */
    node: string | HttpClient;
    /**
     * Options for the WalletConnect integration
     */
    walletConnectOptions?: WalletConnectOptions;
    /**
     * Whether to persist the wallet source/ account
     * @default false
     */
    usePersistence?: boolean;
    /**
     * Whether to use the first detected wallet source.
     * @default false
     */
    useFirstDetectedSource?: boolean;
    /**
     * The log level to use for the DAppKitUI logger
     * @default LogLevel.NONE
     */
    logLevel?: LogLevel;
    /**
     * Whether to require a connection certificate
     * @default true
     */
    requireCertificate?: boolean;
    /**
     * Options for the connection certificate
     */
    connectionCertificate?: CertificateArgs;
    /**
     * An array of wallet sources to allow
     */
    allowedWallets?: WalletSource[];
    /**
     * Whether to support the new methods.
     * @default false
     */
    supportNewMethods?: boolean;
    /**
     * ID of the genesis block. It is the `id` property of the block #0, <node>/blocks/0 is the HTTP call to perform.
     */
    genesisId: string;
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

interface WalletProvider {
    request(args: {
        method: 'thor_connect';
        params: {
            value:
                | {
                      domain: TypedDataDomain;
                      types: Record<string, TypedDataParameter[]>;
                      value: Record<string, unknown>;
                  }
                | CertificateMessage
                | null;
            external?: boolean;
        };
        genesisId: string;
    }): Promise<
        | CertificateResponse
        | { signer: string; signature: string }
        | { signer: string }
    >;
    request(args: {
        method: 'thor_wallet';
        params?: undefined;
        genesisId: string;
    }): Promise<string>;
    request(args: {
        method: 'thor_disconnect';
        params?: undefined;
        genesisId: string;
    }): Promise<void>;
    request(args: {
        method: 'thor_switchWallet';
        params?: undefined;
        genesisId: string;
    }): Promise<string>;
    request(args: {
        method: 'thor_methods';
        params?: undefined;
        genesisId: string;
    }): Promise<string[]>;
    request(args: {
        method: 'thor_signTypedData';
        params: {
            domain: TypedDataDomain;
            types: Record<string, TypedDataParameter[]>;
            value: Record<string, unknown>;
            options?: SignTypedDataOptions;
        };
        genesisId: string;
    }): Promise<string>;
    request(args: {
        method: 'thor_signCertificate';
        params: {
            message: CertificateMessage;
            options: CertificateOptions;
        };
        genesisId: string;
    }): Promise<string>;
    request(args: {
        method: 'thor_sendTransaction';
        params: {
            clauses: TransactionMessage;
            options?: TransactionOptions;
        };
        genesisId: string;
    }): Promise<string>;
}

/**
 * Modifies the WalletSigner interface to include a disconnect method
 */
type VeChainWallet = WalletSigner & {
    connect: ConnectCallback;
    disconnect?: () => void | Promise<void>;
    getAddress: () => string | null | Promise<string | null>;
    getAvailableMethods: () => string[] | null | Promise<string[] | null>;
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
    availableMethods: string[] | null;
}

export type {
    CertificateArgs,
    ConnectCallback,
    ConnectResponse,
    DAppKitOptions,
    DriverSignedTypedData,
    Genesis,
    SignTypedDataOptions,
    VeChainWallet,
    WalletConfig,
    WalletManagerState,
    WalletProvider,
    WalletSigner,
    WalletSource,
};
