import type { Connex1 } from '@vechain/connex/esm/signer';
import type { WalletConnectOptions } from '@vechain/wallet-connect';
import type { WalletSource } from './wallet';

declare global {
    interface Window {
        vechain?: {
            newConnexSigner: (genesisId: string) => Connex.Signer;
        };
        connex?: Connex1;
    }
}

export type Genesis = 'main' | 'test' | Connex.Thor.Block;

interface ConnexOptions {
    nodeUrl: string;
    genesis?: Genesis;
    onDisconnected: () => void;
    source?: WalletSource;
    walletConnectOptions?: WalletConnectOptions;
}

interface ConnexInstance {
    thor: Connex.Thor;
    vendor: Connex.Vendor;
    setSource: (source: WalletSource) => void;
    disconnect: () => Promise<void>;
    source: WalletSource | undefined;
}

/**
 * Modifies the Connex.Signer interface to include a disconnect method
 */
type ConnexSigner = Connex.Signer & {
    disconnect?: () => Promise<void>;
};

export type { ConnexOptions, ConnexInstance, ConnexSigner };
