/// <reference types="@vechain/connex" />
import type React from 'react';
import type {
    ConnectResponse,
    DAppKitOptions,
    WalletSource,
} from '@vechain/dapp-kit';

export interface AccountState {
    address: string | null;
    source: WalletSource | null;
}

/**
 * Connex Provider Options
 * @param children - React children
 */
export type DAppKitProviderOptions = DAppKitOptions & {
    children: React.ReactNode;
};

/**
 * Connex Context
 * This context is used to provide the Connex instance and the Connex Vendor instance
 * to the application.
 */

export interface DAppKitContext {
    connex: {
        thor: Connex.Thor;
        vendor: Connex.Vendor;
    };
    wallet: {
        setSource: (source: WalletSource) => void;
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
