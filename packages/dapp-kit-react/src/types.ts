import type React from 'react';
import type {
    ConnectResponse,
    VeChainSignerDAppKit,
    WalletSource,
} from '@vechain/dapp-kit';
import { type DAppKitUIOptions } from '@vechain/dapp-kit-ui';
import type { CertificateData } from '@vechain/sdk-core';
import type { ThorClient } from '@vechain/sdk-network';

export type { WalletConnectOptions, DAppKitOptions } from '@vechain/dapp-kit';
export type { DAppKitUIOptions } from '@vechain/dapp-kit-ui';

export interface AccountState {
    address: string | null;
    source: WalletSource | null;
}

/**
 * DAppKit Provider Options
 * @param children - React children
 */
export type DAppKitProviderOptions = DAppKitUIOptions & {
    children: React.ReactNode;
};

/**
 * DAppKit Context
 * This context is used to provide the Wallet and Thor instances
 * to the application.
 */

export interface DAppKitContext {
    thor: ThorClient;
    wallet: {
        setSource: (source: WalletSource) => void;
        availableWallets: WalletSource[];
        disconnect: () => void;
        connect: () => Promise<ConnectResponse>;
        account: string | null;
        signer: VeChainSignerDAppKit | undefined;
        source: WalletSource | null;
        connectionCertificate: CertificateData | null;
    };
    modal: {
        open: () => void;
        close: () => void;
        onConnectionStatusChange: (
            callback: (address: string | null) => void,
        ) => void;
    };
}
