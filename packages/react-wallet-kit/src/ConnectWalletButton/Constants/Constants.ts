import type { WalletSource } from '@vechain/wallet-kit';
import { Colors } from './colors';

interface SourceInfo {
    name: string;
    logo: string;
}

const baseLogoUrl = `${process.env.PUBLIC_URL || ''}/images/logo`;

export const WalletSources: Record<WalletSource, SourceInfo> = {
    'wallet-connect': {
        name: 'Wallet Connect',
        logo: `${baseLogoUrl}/wallet-connect-logo.png`,
    },
    'veworld-extension': {
        name: 'VeWorld Extension',
        logo: `${baseLogoUrl}/veworld_black.png`,
    },
    sync: {
        name: 'Sync',
        logo: `${baseLogoUrl}/sync.png`,
    },
    sync2: {
        name: 'Sync 2',
        logo: `${baseLogoUrl}/sync2.png`,
    },
};

// themes.js

export const lightTheme = {
    backgroundColor: Colors.White,
    textColor: Colors.DarkGray,
    modalButtonBackgroundColor: Colors.LightGray,
};

export const darkTheme = {
    backgroundColor: Colors.Dark,
    textColor: Colors.White,
    modalButtonBackgroundColor: Colors.DarkGray,
};
