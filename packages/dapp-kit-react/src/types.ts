import type React from 'react';
import type {
    CertificateResponse,
    CertMessage,
    CertOptions,
    ConnectResponse,
    ExtendedClause,
    SendTxOptions,
    TransactionResponse,
    WalletSource,
} from '@vechain/dapp-kit';
import { type DAppKitUIOptions } from '@vechain/dapp-kit-ui';
import { Certificate } from '@vechain/sdk-core';
import { ThorClient } from '@vechain/dapp-kit';
export type {
    WalletConnectOptions,
    DAppKitOptions,
    ThorClient,
} from '@vechain/dapp-kit';

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
    thor: ThorClient;
    wallet: {
        setSource: (source: WalletSource) => void;
        requestTransaction: (
            clauses: ExtendedClause[],
            options?: SendTxOptions,
        ) => Promise<TransactionResponse>;
        signCertificate: (
            msg: CertMessage,
            options?: CertOptions,
        ) => Promise<CertificateResponse>;
        availableWallets: WalletSource[];
        disconnect: () => void;
        connect: () => Promise<ConnectResponse>;
        account: string | null;
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
