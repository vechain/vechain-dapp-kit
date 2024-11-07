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

type BaseWallet = WalletSigner & {
    disconnect?: () => Promise<void> | void;
};

/**
 * Modifies the WalletSigner interface to include a disconnect method
 */
type VechainWallet = BaseWallet & {
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
    availableSources: WalletSource[];
    connectionCertificate: CertificateData | null;
}

export type {
    BaseWallet,
    DAppKitOptions,
    VechainWallet,
    WalletConfig,
    WalletSource,
    WalletManagerState,
    ConnectResponse,
    Genesis,
    WalletSigner,
};
