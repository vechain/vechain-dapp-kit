/**
 * Wallet types
 */

import type { WalletConfig, WalletSource } from '../types';

const DEFAULT_CONFIG: WalletConfig = {
    requiresCertificate: true,
};

const WalletMapping: Record<WalletSource, WalletConfig> = {
    'wallet-connect': {
        requiresCertificate: false,
    },
    veworld: DEFAULT_CONFIG,
    sync2: DEFAULT_CONFIG,
    sync: DEFAULT_CONFIG,
};

const WalletSources = Object.keys(WalletMapping) as WalletSource[];

Object.freeze(WalletMapping);
Object.freeze(WalletSources);

export { WalletMapping, WalletSources };
