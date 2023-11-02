import type { Connex1 } from '@vechain/connex/esm/signer';
import type { WalletConnectOptions } from '@vechain/wallet-connect';

declare global {
    interface Window {
        vechain?: {
            newConnexSigner: (genesisId: string) => Connex.Signer;
        };
        connex?: Connex1;
    }
}

type WalletSource = 'wallet-connect' | 'veworld-extension' | 'sync2' | 'sync';

interface WalletConfig {
    requiresCertificate: boolean;
}

export type Genesis = 'main' | 'test' | Connex.Thor.Block;

interface ConnexOptions {
    nodeUrl: string;
    genesis?: Genesis;
    onDisconnected: () => void;
    source?: WalletSource;
    walletConnectOptions?: WalletConnectOptions;
}

type BaseWallet = Connex.Signer & {
    disconnect?: () => Promise<void> | void;
};

/**
 * Modifies the Connex.Signer interface to include a disconnect method
 */
type ConnexWallet = BaseWallet & {
    connect: () => Promise<ConnectResponse>;
    signIn: (
        msg?: Connex.Vendor.CertMessage,
        options?: Connex.Signer.CertOptions,
    ) => Promise<Connex.Vendor.CertResponse>;
};

export interface ConnectResponse {
    account: string;
    verified: boolean;
}

type ConnexWalletManager = ConnexWallet & {
    setSource: (src: WalletSource) => void;
    disconnect: () => Promise<void> | void;
};

type ConnexInstance = Connex & {
    wallet: ConnexWalletManager;
};

export type {
    BaseWallet,
    ConnexOptions,
    ConnexInstance,
    ConnexWallet,
    WalletConfig,
    WalletSource,
    ConnexWalletManager,
};
