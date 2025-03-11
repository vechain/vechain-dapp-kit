import { describe, expect, it, vi } from 'vitest';
import { createWallet } from '../src';
import type {
    DAppKitOptions,
    WalletConnectOptions,
    WalletSource,
} from '../src';
import { WalletSigner } from '../src/types/types';
import { ThorClient } from '@vechain/sdk-network';

type ICreateWallet = DAppKitOptions & {
    source: WalletSource;
    onDisconnected: () => void;
    thor: ThorClient;
};

const createOptions = (
    source: WalletSource,
    wcOptions?: WalletConnectOptions,
): ICreateWallet => {
    return {
        node: 'https://testnet.veblocks.net/',
        source,
        walletConnectOptions: wcOptions,
        onDisconnected: () => {},
        thor: ThorClient.at('https://testnet.vechain.org'),
    };
};

vi.mock('@walletconnect/modal');

describe('createWallet', () => {
    describe('veworld', () => {
        it('is not installed', () => {
            window.vechain = undefined;

            expect(() => {
                createWallet(createOptions('veworld'));
            }).toThrowError('VeWorld Extension is not installed');
        });

        it('is installed', () => {
            window.vechain = {
                newConnexSigner: () => ({}) as WalletSigner,
            };

            const wallet = createWallet(createOptions('veworld'));

            expect(wallet).toBeDefined();
        });
    });

    describe('wallet-connect', () => {
        it('no options provided', () => {
            expect(() => {
                createWallet(createOptions('wallet-connect'));
            }).toThrowError('WalletConnect options are not provided');
        });

        it('options provided', () => {
            const wallet = createWallet(
                createOptions('wallet-connect', {
                    projectId: '123',
                    metadata: {
                        name: 'test',
                        description: 'test',
                        url: 'test',
                        icons: ['test'],
                    },
                }),
            );

            expect(wallet).toBeDefined();
        });
    });
});
