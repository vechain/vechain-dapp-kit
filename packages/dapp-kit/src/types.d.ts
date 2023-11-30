import type { WalletConnectOptions } from '@vechainfoundation/dapp-kit';
import type { LogLevel } from './utils/logger';

declare global {
    interface Window {
        vechain?: {
            newConnexSigner: (genesisId: string) => Connex.Signer;
        };
        connex?: unknown;
    }
}

type WalletSource = 'wallet-connect' | 'veworld' | 'sync2' | 'sync';

interface WalletConfig {
    requiresCertificate: boolean;
}

type Genesis = 'main' | 'test' | Connex.Thor.Block;

/**
 * Options for the MultiWalletConnex class
 * @param nodeUrl - The URL of the VeChain node to connect to
 * @param genesis - Optional. The genesis block of the VeChain network you want to connect to. Eg, 'main', 'test', or a Connex.Thor.Block object
 * @param onDisconnected - A callback that will be called when the session is disconnected
 * @param walletConnectOptions - Optional. Options for the WalletConnect integration
 * @param usePersistence - Optional. Whether to persist the wallet source/ account
 * @param useFirstDetectedSource - Optional. Whether to use the first detected wallet source. Defaults to false
 * @param logLevel - Optional. The log level to use for the DAppKit logger
 */
interface ConnexOptions {
    nodeUrl: string;
    genesis?: Genesis;
    walletConnectOptions?: WalletConnectOptions;
    usePersistence?: boolean;
    useFirstDetectedSource?: boolean;
    logLevel?: LogLevel;
}

type BaseWallet = Connex.Signer & {
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
}

interface WalletManagerState {
    source: WalletSource | null;
    address: string | null;
    availableSources: WalletSource[];
}

export type {
    BaseWallet,
    ConnexOptions,
    ConnexWallet,
    WalletConfig,
    WalletSource,
    WalletManagerState,
    ConnectResponse,
    Genesis,
};
