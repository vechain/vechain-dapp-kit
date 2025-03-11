import { vi } from 'vitest';
import type { WalletConnectOptions } from '../../src';
import { DAppKit } from '../../src';

export const createUnitTestConnex = (
    walletConnectOptions?: WalletConnectOptions,
): DAppKit => {
    if (walletConnectOptions) {
        walletConnectOptions.modal = {
            openModal: vi.fn(),
            closeModal: vi.fn(),
            subscribeModal: () => {
                return vi.fn();
            },
        };
    }

    return new DAppKit({
        node: 'https://mainnet.vechain.org/',
        walletConnectOptions,
    });
};
