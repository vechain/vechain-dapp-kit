import { vi } from 'vitest';
import type { WalletConnectOptions } from '../../src';
import { MultiWalletConnex } from '../../src';

export const createUnitTestConnex = (
    walletConnectOptions?: WalletConnectOptions,
): MultiWalletConnex => {
    return new MultiWalletConnex({
        nodeUrl: 'https://mainnet.vechain.org/',
        walletConnectOptions,
        customWcModal: {
            openModal: vi.fn(),
            closeModal: vi.fn(),
            subscribeModal: () => {
                return vi.fn();
            },
        },
    });
};
