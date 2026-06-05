import type {
    CertificateMessage,
    CertificateOptions,
    CertificateResponse,
    ConnectCallback,
    ConnectV2Callback,
    TransactionMessage,
    TransactionOptions,
    TransactionResponse,
    VeChainSignerDAppKit,
    VeChainWallet,
    WalletSource,
} from '@vechain/dapp-kit';
import { type DAppKitUIOptions } from '@vechain/dapp-kit-ui';
import type { CertificateData } from '@vechain/sdk-core';
import type { ThorClient } from '@vechain/sdk-network';
import type React from 'react';
export type { DAppKitOptions, WalletConnectOptions } from '@vechain/dapp-kit';
export type { DAppKitUIOptions } from '@vechain/dapp-kit-ui';

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
        connect: ConnectCallback;
        account: string | null;
        /**
         * Full set of addresses the user has approved for this dApp in the
         * connected wallet (currently only populated by VeWorld v2). First
         * entry mirrors `account` when populated; otherwise `[]`.
         */
        accounts: string[];
        /**
         * Switch the active account to one already in `accounts` WITHOUT
         * reopening the wallet picker. Throws if the address has not been
         * approved.
         */
        setActiveAccount: (address: string) => void;
        /**
         * Ask the wallet to (re-)display its approval picker so the user
         * can grant access to additional accounts. Returns the new approved
         * set (also written to `accounts`). Currently only meaningful for
         * VeWorld v2 (`wallet_requestPermissions`).
         */
        requestPermissions: () => Promise<string[]>;
        /**
         * Revoke this dApp's permission for one approved account. Returns the
         * remaining approved account set and switches away if the active account
         * was revoked.
         */
        revokeAccount: (address: string) => Promise<string[]>;
        accountDomain: string | null;
        accountDomains: Record<string, string | null>;
        isAccountDomainLoading: boolean;
        signer: VeChainSignerDAppKit;
        source: WalletSource | null;
        connectionCertificate: CertificateData | null;
        requestCertificate: (
            message: CertificateMessage,
            options?: CertificateOptions,
        ) => Promise<CertificateResponse>;
        requestTransaction: (
            clauses: TransactionMessage[],
            options?: TransactionOptions,
        ) => Promise<TransactionResponse>;
        requestTypedData: NonNullable<VeChainWallet['signTypedData']>;
        switchWallet: () => Promise<void>;
        initializeAsync: () => Promise<void>;
        connectV2: ConnectV2Callback;
        availableMethods: string[];
        isSwitchWalletEnabled: boolean;
    };
    modal: {
        open: () => void;
        close: () => void;
        onConnectionStatusChange: (
            callback: (address: string | null) => void,
        ) => void;
    };
}
