import type {
    CertificateMessage,
    CertificateOptions,
    CertificateResponse,
    ConnectCallback,
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
        accountDomain: string | null;
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
    };
    modal: {
        open: () => void;
        close: () => void;
        onConnectionStatusChange: (
            callback: (address: string | null) => void,
        ) => void;
    };
}
