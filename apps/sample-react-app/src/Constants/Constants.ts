import type { WalletSource } from '@vechain/wallet-kit';

export const NODE_URL = 'https://testnet.vechain.org/';
export const NODE_NETWORK = 'test';

interface SourceInfo {
    name: string;
    logo: string;
}

const baseLogoUrl = `${process.env.PUBLIC_URL}/images/logo`;

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
