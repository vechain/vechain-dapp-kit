import type { Connex1 } from '@vechain/connex/esm/signer';
import type { WalletConnectOptions } from '@vechainfoundation/wallet-kit';
import type { WCModal } from './wallet-connect';

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

/**
 * Options for the MultiWalletConnex class
 * @param nodeUrl - The URL of the VeChain node to connect to
 * @param genesis - Optional. The genesis block of the VeChain network you want to connect to. Eg, 'main', 'test', or a Connex.Thor.Block object
 * @param onDisconnected - A callback that will be called when the session is disconnected
 * @param walletConnectOptions - Optional. Options for the WalletConnect integration
 */
interface ConnexOptions {
    nodeUrl: string;
    genesis?: Genesis;
    walletConnectOptions?: WalletConnectOptions;
    customWcModal?: WCModal;
}

type BaseWallet = Connex.Signer & {
    disconnect?: () => Promise<void> | void;
};

/**
 * Modifies the Connex.Signer interface to include a disconnect method
 */
type ConnexWallet = BaseWallet & {
    connect: () => Promise<ConnectResponse>;
};

export interface ConnectResponse {
    account: string;
    verified: boolean;
}

export type {
    BaseWallet,
    ConnexOptions,
    ConnexWallet,
    WalletConfig,
    WalletSource,
};
