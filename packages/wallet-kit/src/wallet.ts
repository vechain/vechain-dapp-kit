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

export { WalletMapping };

export type { WalletConfig, WalletSource };
