/// <reference types="@vechain/connex" />
import type React from 'react';
import type { ConnectResponse, WalletSource } from '@vechain/dapp-kit';
import { type DAppKitUIOptions } from '@vechain/dapp-kit-ui';
import { type Certificate } from '@vechain/sdk-core';
import type { ThorClient } from '@vechain/sdk-network';
import { VeChainSignerDappKit } from '@vechain/dapp-kit/src/classes/vechain-signer';

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
    sdk: {
        thor: ThorClient;
    };
    wallet: {
        setSource: (source: WalletSource) => void;
        availableWallets: WalletSource[];
        disconnect: () => void;
        connect: () => Promise<ConnectResponse>;
        account: string | null;
        signer: VeChainSignerDappKit | undefined;
        source: WalletSource | null;
        connectionCertificate: Certificate | null;
    };
    modal: {
        open: () => void;
        close: () => void;
        onConnectionStatusChange: (
            callback: (address: string | null) => void,
        ) => void;
    };
}
