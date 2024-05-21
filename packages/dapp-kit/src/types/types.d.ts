import type { WalletConnectOptions } from '@vechain/dapp-kit';
import type { LogLevel } from '../utils/logger';
import type { Certificate } from '@vechain/sdk-core';
import type {
    CertificateResponse,
    CertMessage,
    CertOptions,
    ExtendedClause,
    SendTxOptions,
    WalletTransactionResponse,
} from './signer';
import { CompressedBlockDetail } from '@vechain/sdk-network';

declare global {
    interface Window {
        vechain?: {
            newConnexSigner: (genesisId: string) => BaseWallet;
            isInAppBrowser?: boolean;
        };
        connex?: any;
    }
}

type WalletSource = 'wallet-connect' | 'veworld' | 'sync2' | 'sync';

interface WalletConfig {
    requiresCertificate: boolean;
}

type Genesis = 'main' | 'test';

/**
 * Options for the DAppKit class
 * @param nodeUrl - The URL of the VeChain node to connect to
 * @param genesis - Optional. The genesis block of the VeChain network you want to connect to. Eg, 'main', 'test'
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
        message?: CertMessage;
        options?: CertOptions;
    };
}

interface BaseWallet {
    signTx: (
        clauses: ExtendedClause[],
        options?: SendTxOptions,
    ) => Promise<WalletTransactionResponse>;
    signCert: (
        msg: CertMessage,
        options?: CertOptions,
    ) => Promise<CertificateResponse>;
}

/**
 * Modifies the BaseWallet interface to include a connect/disconnect method
 */
type RemoteWallet = BaseWallet & {
    connect: (addr?: string) => Promise<ConnectResponse>;
    disconnect?: () => Promise<void>;
};

interface ConnectResponse {
    account: string;
    verified: boolean;
    connectionCertificate?: Certificate;
}

interface WalletManagerState {
    source: WalletSource | null;
    address: string | null;
    availableSources: WalletSource[];
    connectionCertificate: Certificate | null;
}

export type GetGenesisBlockFunc = () => Promise<CompressedBlockDetail>;

export type {
    BaseWallet,
    DAppKitOptions,
    RemoteWallet,
    WalletConfig,
    WalletSource,
    WalletManagerState,
    ConnectResponse,
    Genesis,
};
