import type { WalletSource } from '@vechainfoundation/wallet-kit';
import {
    Sync2Logo,
    SyncLogo,
    VeWorldLogo,
    WalletConnectLogo,
} from '@vechainfoundation/vanilla-wallet-kit';

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

// themes.js

export const lightTheme = {
    mode: 'LIGHT',
};

export const darkTheme = {
    mode: 'DARK',
};
