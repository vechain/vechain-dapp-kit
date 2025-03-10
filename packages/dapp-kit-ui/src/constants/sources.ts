import type { WalletSource } from '@vechain/dapp-kit';
import {
    Sync2Logo,
    SyncLogo,
    VeWorldLogo,
    WalletConnectLogo,
} from '../assets/images';

export interface SourceInfo {
    id: WalletSource;
    name: string;
    logo: string;
}

export const WalletSources: Record<WalletSource, SourceInfo> = {
    'wallet-connect': {
        id: 'wallet-connect',
        name: 'Wallet Connect',
        logo: WalletConnectLogo,
    },
    veworld: {
        id: 'veworld',
        name: 'VeWorld',
        logo: VeWorldLogo,
    },
    sync: {
        id: 'sync',
        name: 'Sync',
        logo: SyncLogo,
    },
    sync2: {
        id: 'sync2',
        name: 'Sync2',
        logo: Sync2Logo,
    },
};
