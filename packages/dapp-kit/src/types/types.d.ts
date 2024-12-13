import type { CertificateData } from '@vechain/sdk-core';
import type { CompressedBlockDetail } from '@vechain/sdk-network';
import type { WalletConnectOptions } from '@vechain/dapp-kit';
import type { LogLevel } from '../utils';
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
 * Options for the DAppKit class
 * @param nodeUrl - The URL of the VeChain node to connect to
 * @param genesis - Optional. The genesis block of the VeChain network you want to connect to. Eg, 'main', 'test', or a genesis block
 * @param onDisconnected - A callback that will be called when the session is disconnected
 * @param walletConnectOptions - Optional. Options for the WalletConnect integration
 * @param usePersistence - Optional. Whether to persist the wallet source/ account
 * @param useFirstDetectedSource - Optional. Whether to use the first detected wallet source. Defaults to false
 * @param logLevel - Optional. The log level to use for the DAppKitUI logger
 * @param requireCertificate - Optional. Whether to require a connection certificate. Defaults to true
 * @param connectionCertificate - Optional. Options for the connection certificate
 * @param customNet - Optional. A custom network to use. Defaults to the mainnet
 * @param allowedWallets - Optional. An array of wallet sources to allow. Defaults to all sources
 */
interface DAppKitOptions {
    nodeUrl: string;
    walletConnectOptions?: WalletConnectOptions;
    usePersistence?: boolean;
    useFirstDetectedSource?: boolean;
    logLevel?: LogLevel;
    requireCertificate?: boolean;
    connectionCertificate?: {
        message?: CertificateMessage;
        options?: CertificateOptions;
    };
    customNet?: Net;
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
}

/**
 * Modifies the WalletSigner interface to include a disconnect method
 */
type VeChainWallet = WalletSigner & {
    connect: () => Promise<ConnectResponse>;
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
    DAppKitOptions,
    VeChainWallet,
    WalletConfig,
    WalletSource,
    WalletManagerState,
    ConnectResponse,
    Genesis,
    WalletSigner,
};
