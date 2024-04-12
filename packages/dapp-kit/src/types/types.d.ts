import type { WalletConnectOptions } from '@vechain/dapp-kit';
import type { LogLevel } from '../utils/logger';
import { Certificate } from '@vechain/sdk-core';
import {
    CertificateResponse,
    CertMessage,
    CertOptions,
    ExtendedClause,
    SendTxOptions,
    SendTxResponse,
} from './signer';
import {ThorClient as SDKClient} from "@vechain/sdk-network/src/thor-client/thor-client"

declare global {
    interface Window {
        vechain?: {
            newConnexSigner: (genesisId: string) => BaseWallet;
            isInAppBrowser?: boolean;
        };
        connex?: unknown;
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
    genesis?: Genesis;
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

type BaseWallet = Signer & {
    disconnect?: () => Promise<void> | void;
    signTx: (
        clauses: ExtendedClause[],
        options?: SendTxOptions,
    ) => Promise<SendTxResponse>;
    signCert: (
        msg: CertMessage,
        options?: CertOptions,
    ) => Promise<CertificateResponse>;
};

/**
 * Modifies the BaseWallet interface to include a disconnect method
 */
type RemoteWallet = BaseWallet & {
    connect: () => Promise<ConnectResponse>;
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


type TransactionsModule = Omit<typeof SDKClient.prototype.transactions, 'signTransaction'>;

interface ThorClient extends Omit<SDKClient, 'transactions'> {
    transactions: TransactionsModule
}

export type {
    BaseWallet,
    DAppKitOptions,
    RemoteWallet,
    WalletConfig,
    WalletSource,
    WalletManagerState,
    ConnectResponse,
    Genesis,
    ThorClient,
};
