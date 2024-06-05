import { describe, expect, it, vi } from 'vitest';
import { createWallet } from '../src/utils';
import type {
    BaseWallet,
    DAppKitOptions,
    WalletConnectOptions,
    WalletSource,
} from '../src';
import { ThorClient } from '@vechain/sdk-network';

type ICreateWallet = DAppKitOptions & {
    source: WalletSource;
    onDisconnected: () => void;
    thorClient: ThorClient;
};

const createOptions = (
    source: WalletSource,
    wcOptions?: WalletConnectOptions,
): ICreateWallet => {
    return {
        nodeUrl: 'https://testnet.veblocks.net/',
        source,
        walletConnectOptions: wcOptions,
        onDisconnected: () => {},
        thorClient: ThorClient.fromUrl('https://testnet.vechain.org'),
    };
};

vi.mock('@walletconnect/modal');

describe('createWallet', () => {
    describe('sync', () => {
        it('is NOT in sync browser', () => {
            window.connex = undefined;

            expect(() => {
                createWallet(createOptions('sync'));
            }).toThrowError('User is not in a Sync wallet');
        });

        it('is in sync2 browser', () => {
            window.connex = {} as any;

            const wallet = createWallet(createOptions('sync2'));

            expect(wallet).toBeDefined();
        });
    });

    describe('veworld', () => {
        it('is not installed', () => {
            window.vechain = undefined;

            expect(() => {
                createWallet(createOptions('veworld'));
            }).toThrowError('VeWorld Extension is not installed');
        });

        it('is installed', () => {
            window.vechain = {
                newConnexSigner: () => ({} as any as BaseWallet),
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
