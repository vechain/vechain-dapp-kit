/// <reference types="@vechain/connex" />
import type React from 'react';
import type {
    ConnectResponse,
    WalletManager,
    WalletSource,
} from '@vechain/dapp-kit';
import { type DAppKitUIOptions } from '@vechain/dapp-kit-ui';
import { type Certificate } from '@vechain/sdk-core';

export type { WalletConnectOptions, DAppKitOptions } from '@vechain/dapp-kit';
export type { DAppKitUIOptions } from '@vechain/dapp-kit-ui';

export interface AccountState {
    address: string | null;
    source: WalletSource | null;
}

/**
 * Connex Provider Options
 * @param children - React children
 */
export type DAppKitProviderOptions = DAppKitUIOptions & {
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
        accountDomain: string | null;
        isAccountDomainLoading: boolean;
        source: WalletSource | null;
        connectionCertificate: Certificate | null;
        signTypedData: WalletManager['signTypedData'];
    };
    modal: {
        open: () => void;
        close: () => void;
        onConnectionStatusChange: (
            callback: (address: string | null) => void,
        ) => void;
    };
}
