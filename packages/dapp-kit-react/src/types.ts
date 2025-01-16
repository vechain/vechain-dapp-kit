/// <reference types="@vechain/connex" />
import type {
    ConnectCallback,
    WalletManager,
    WalletSource,
} from '@vechain/dapp-kit';
import { type DAppKitUIOptions } from '@vechain/dapp-kit-ui';
import { CertificateData } from '@vechain/sdk-core';
import type React from 'react';

export type { DAppKitOptions, WalletConnectOptions } from '@vechain/dapp-kit';
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
        connect: ConnectCallback;
        account: string | null;
        accountDomain: string | null;
        isAccountDomainLoading: boolean;
        source: WalletSource | null;
        connectionCertificate: CertificateData | null;
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
