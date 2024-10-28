import type { WalletConnectOptions } from '@vechain/dapp-kit';
import { CertificateData } from '@vechain/sdk-core';
import type { LogLevel } from '../utils';

declare global {
    interface Window {
        vechain?: {
            newConnexSigner: (genesisId: string) => ExpandedConnexSigner;
            isInAppBrowser?: boolean;
        };
        connex?: unknown;
    }
}

interface ExpandedConnexSigner extends Connex.Signer {
    signTypedData: (
        _domain: ethers.TypedDataDomain,
        _types: Record<string, ethers.TypedDataField[]>,
        _value: Record<string, unknown>,
        _options?: SignTypedDataOptions,
    ) => Promise<string>;
}

type WalletSource = 'wallet-connect' | 'veworld' | 'sync2' | 'sync';

interface WalletConfig {
    requiresCertificate: boolean;
}

type Genesis = 'main' | 'test' | Connex.Thor.Block;

/**
 * Options for the DAppKit class
 * @param nodeUrl - The URL of the VeChain node to connect to
 * @param genesis - Optional. The genesis block of the VeChain network you want to connect to. Eg, 'main', 'test', or a Connex.Thor.Block object
 * @param onDisconnected - A callback that will be called when the session is disconnected
 * @param walletConnectOptions - Optional. Options for the WalletConnect integration
 * @param usePersistence - Optional. Whether to persist the wallet source/ account
 * @param useFirstDetectedSource - Optional. Whether to use the first detected wallet source. Defaults to false
 * @param logLevel - Optional. The log level to use for the DAppKitUI logger
 */
interface DAppKitOptions {
    nodeUrl: string;
    genesis?: Genesis;
    walletConnectOptions?: WalletConnectOptions;
    usePersistence?: boolean;
    useFirstDetectedSource?: boolean;
    logLevel?: LogLevel;
    requireCertificate?: boolean;
    connectionCertificate?: {
        message?: Connex.Vendor.CertMessage;
        options?: Connex.Signer.CertOptions;
    };
    customNet?: Net;
}

type BaseWallet = ExpandedConnexSigner & {
    disconnect?: () => Promise<void> | void;
};

/**
 * Modifies the Connex.Signer interface to include a disconnect method
 */
type ConnexWallet = BaseWallet & {
    connect: () => Promise<ConnectResponse>;
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

interface SignTypedDataOptions {
    signer?: string;
}

export type {
    BaseWallet,
    DAppKitOptions,
    ConnexWallet,
    WalletConfig,
    WalletSource,
    WalletManagerState,
    ConnectResponse,
    Genesis,
    SignTypedDataOptions,
    ExpandedConnexSigner,
    DriverSignedTypedData,
};
