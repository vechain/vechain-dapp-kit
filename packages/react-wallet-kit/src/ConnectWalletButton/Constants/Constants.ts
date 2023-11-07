import type { WalletSource } from '@vechain/wallet-kit';
import {
    Sync2Logo,
    SyncLogo,
    VeWorldLogo,
    WalletConnectLogo,
} from '@vechain/vanilla-wallet-kit';

interface SourceInfo {
    name: string;
    logo: string;
}

export const WalletSources: Record<WalletSource, SourceInfo> = {
    'wallet-connect': {
        name: 'Wallet Connect',
        logo: WalletConnectLogo,
    },
    'veworld-extension': {
        name: 'VeWorld Extension',
        logo: VeWorldLogo,
    },
    sync: {
        name: 'Sync',
        logo: SyncLogo,
    },
    sync2: {
        name: 'Sync 2',
        logo: Sync2Logo,
    },
};
