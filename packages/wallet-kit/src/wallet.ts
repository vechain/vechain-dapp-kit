/**
 * Wallet types
 */

type WalletSource = 'wallet-connect' | 'veworld-extension' | 'sync2' | 'sync';

interface WalletConfig {
    requiresCertificate: boolean;
}

const DEFAULT_CONFIG: WalletConfig = {
    requiresCertificate: true,
};

const WalletMapping: Record<WalletSource, WalletConfig> = {
    'wallet-connect': {
        requiresCertificate: false,
    },
    'veworld-extension': DEFAULT_CONFIG,
    sync2: DEFAULT_CONFIG,
    sync: DEFAULT_CONFIG,
};

const WalletSources = Object.keys(WalletMapping) as WalletSource[];

Object.freeze(WalletMapping);
Object.freeze(WalletSources);

export { WalletMapping, WalletSources };

export type { WalletConfig, WalletSource };
