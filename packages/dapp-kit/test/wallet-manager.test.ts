import { describe, expect, it, vi } from 'vitest';
import type { WalletConnectOptions } from '../src';
import { WalletManager } from '../src';
import { mockedConnexSigner } from './helpers/mocked-signer';

const newWalletManager = (wcOptions?: WalletConnectOptions): WalletManager => {
    return new WalletManager({
        nodeUrl: 'https://testnet.veblocks.net/',
        walletConnectOptions: wcOptions,
        genesis: 'main',
    });
};

window.vechain = {
    newConnexSigner: () => mockedConnexSigner,
};

const eventNames = (walletManager: WalletManager): string[] =>
    //@ts-ignore
    walletManager.eventEmitter.eventNames();

const listener = () => {};

describe('WalletManager', () => {
    describe('setSource', () => {
        it('no wc options provided', () => {
            const walletManager = newWalletManager();
            expect(() => {
                walletManager.setSource('wallet-connect');
            }).toThrowError('WalletConnect options are not provided');
        });
    });

    describe('connect', () => {
        it('no source set', async () => {
            const walletManager = newWalletManager();

            await expect(async () => walletManager.connect()).rejects.toThrow(
                'No wallet has been selected',
            );
        });
    });

    describe('signTx', () => {
        it('should sign the tx', async () => {
            const walletManager = newWalletManager();
            walletManager.setSource('veworld');
            const res = await walletManager.signTx([], {});

            expect(res.txid).toBeDefined();
        });
    });

    describe('signCert', () => {
        it('should sign the cert', async () => {
            const walletManager = newWalletManager();
            walletManager.setSource('veworld');
            const res = await walletManager.signCert(
                {
                    payload: { content: 'Hello world', type: 'text' },
                    purpose: 'identification',
                },
                {},
            );

            expect(res.signature).toBeDefined();
        });
    });

    describe('disconnect', () => {
        it('is not connected', async () => {
            const walletManager = newWalletManager();

            await walletManager.disconnect();

            expect(walletManager.state.source).toEqual(null);
        });

        it('from remote', async () => {
            const walletManager = newWalletManager();

            walletManager.setSource('veworld');

            await walletManager.disconnect(true);

            expect(walletManager.state.source).toEqual(null);
        });
    });

    describe('listeners', () => {
        it('add state listener', async () => {
            const walletManager = newWalletManager();

            const subscription = vi.fn();

            walletManager.subscribe(subscription);

            walletManager.setSource('veworld');

            await new Promise((resolve) => setTimeout(resolve, 2000));

            expect(subscription).toHaveBeenCalledTimes(1);
        });

        it('add key listener', async () => {
            const walletManager = newWalletManager();

            const subscription = vi.fn();

            walletManager.subscribeToKey('source', subscription);

            walletManager.setSource('veworld');

            await new Promise((resolve) => setTimeout(resolve, 2000));

            expect(subscription).toHaveBeenCalledTimes(1);
        });
    });
});
