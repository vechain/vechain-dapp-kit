import type { Options } from '@vechain/connex';
import type React from 'react';
import type {
    ConnectResponse,
    WalletConnectOptions,
    WalletSource,
} from '@vechainfoundation/dapp-kit';

export interface AccountState {
    address: string | null;
    source: WalletSource | null;
}

/**
 * Connex Provider Options
 * @param children - React children
 * @param nodeOptions - Connex node options
 * @param walletConnectOptions - WalletConnect options
 * @param persistState - An option to persist state. Defaults to false
 */
export interface ConnexProviderOptions {
    children: React.ReactNode;
    nodeOptions: Omit<Options, 'signer'>;
    walletConnectOptions?: WalletConnectOptions;
    persistState?: boolean;
}

/**
 * Connex Context
 * This context is used to provide the Connex instance and the Connex Vendor instance
 * to the application.
 */

export interface ConnexContext {
    connex: {
        thor: Connex.Thor;
        vendor: Connex.Vendor;
    };
    wallet: {
        setSource: (source: WalletSource) => void;
        setAccount: (account: string) => void;
        availableWallets: WalletSource[];
        disconnect: () => void;
        connect: () => Promise<ConnectResponse>;
        account: string | null;
        source: WalletSource | null;
    };
    modal: {
        open: () => void;
        close: () => void;
    };
}
