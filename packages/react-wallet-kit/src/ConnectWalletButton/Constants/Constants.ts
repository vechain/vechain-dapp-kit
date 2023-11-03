import { WalletSource } from '@vechain/wallet-kit';

interface SourceInfo {
    name: string;
    logo: string;
}

const baseLogoUrl = `${process.env.PUBLIC_URL || ''}/images/logo`;

export const WalletSources: Record<WalletSource, SourceInfo> = {
    [WalletSource.WalletConnect]: {
        name: 'Wallet Connect',
        logo: `${baseLogoUrl}/wallet-connect-logo.png`,
    },
    [WalletSource.VeWorldExtension]: {
        name: 'VeWorld Extension',
        logo: `${baseLogoUrl}/veworld_black.png`,
    },
    [WalletSource.Sync]: {
        name: 'Sync',
        logo: `${baseLogoUrl}/sync.png`,
    },
    [WalletSource.Sync2]: {
        name: 'Sync 2',
        logo: `${baseLogoUrl}/sync2.png`,
    },
};

export const ThemeMode = {
    Light: 'LIGHT',
    Dark: 'DARK',
};
