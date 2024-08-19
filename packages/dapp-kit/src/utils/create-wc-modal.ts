import { WalletConnectModal } from '@walletconnect/modal';
import type { WCModal } from '../types';

const _cachedModals: Record<string, WalletConnectModal | undefined> = {};

const genesisIds = [
    '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a',
    '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
];

const chains = genesisIds.map((id) => {
    return `vechain:${id.slice(-32)}`;
});

/**
 * Creates a new WalletConnectModal instance
 * @param projectId - Your WalletConnect project ID
 */
export const createWcModal = (projectId: string): WCModal => {
    const cached = _cachedModals[projectId];

    if (cached) {
        return cached;
    }

    const modal = new WalletConnectModal({
        projectId,
        explorerRecommendedWalletIds: 'NONE',
        mobileWallets: [
            {
                name: 'VeWorld',
                id: 'veworld-mobile',
                links: {
                    native: 'veworld://org.vechain.veworld.app/',
                    universal: 'https://veworld.com',
                },
            },
        ],
        chains,
        themeVariables: {
            '--wcm-z-index': '99999999',
        },
        walletImages: {
            'veworld-mobile': 'https://www.veworld.net/assets/logo/logo.svg',
        },
    });

    _cachedModals[projectId] = modal;

    return modal;
};
