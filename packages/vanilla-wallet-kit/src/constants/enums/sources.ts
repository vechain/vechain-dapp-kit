import {
    Sync2Logo,
    SyncLogo,
    VeWorldLogo,
    WalletConnectLogo,
} from '../../assets';

enum WalletSource {
    WalletConnect = 'wallet-connect',
    VeWorldExtension = 'veworld-extension',
    Sync2 = 'sync2',
    Sync = 'sync',
}

export interface SourceInfo {
    id: WalletSource;
    name: string;
    logo: string;
}

export const WalletSources: SourceInfo[] = [
    {
        id: WalletSource.WalletConnect,
        name: 'Wallet Connect',
        logo: WalletConnectLogo,
    },
    {
        id: WalletSource.VeWorldExtension,
        name: 'VeWorld Extension',
        logo: VeWorldLogo,
    },
    {
        id: WalletSource.Sync,
        name: 'Sync',
        logo: SyncLogo,
    },
    {
        id: WalletSource.Sync2,
        name: 'Sync 2',
        logo: Sync2Logo,
    },
];
