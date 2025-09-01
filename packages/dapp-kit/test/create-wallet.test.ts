import { ThorClient } from '@vechain/sdk-network';
import { describe, expect, it, vi } from 'vitest';
import type {
    DAppKitOptions,
    WalletConnectOptions,
    WalletSource,
} from '../src';
import { createWallet, WalletSigner } from '../src';
import { mockedHttpClient } from './helpers/mocked-http-client';

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
        node: mockedHttpClient.baseURL,
        source,
        walletConnectOptions: wcOptions,
        onDisconnected: () => {},
        thor: new ThorClient(mockedHttpClient),
        v2Api: {
            enabled: true,
        },
    };
};

vi.mock('@walletconnect/modal');

describe('createWallet', () => {
    describe('veworld', () => {
        it('is not installed', async () => {
            window.vechain = undefined;

            await expect(
                createWallet(createOptions('veworld')),
            ).rejects.toThrowError('VeWorld Extension is not installed');
        });

        it('is installed', async () => {
            window.vechain = {
                newConnexSigner: () => ({}) as WalletSigner,
            };

            const wallet = await createWallet(createOptions('veworld'));

            expect(wallet).toBeDefined();
        });
    });

    describe('wallet-connect', () => {
        it('no options provided', async () => {
            await expect(
                createWallet(createOptions('wallet-connect')),
            ).rejects.toThrowError('WalletConnect options are not provided');
        });

        it('options provided', async () => {
            const wallet = await createWallet(
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
