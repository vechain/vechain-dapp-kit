import { describe, expect, it } from 'vitest';
import type { WalletConnectOptions } from '../src';
import { WalletManager } from '../src';
import { mockedConnexSigner } from './helpers/mocked-signer';

const newWalletManager = (wcOptions?: WalletConnectOptions): WalletManager => {
    return new WalletManager({
        nodeUrl: 'https://testnet.veblocks.net/',
        walletConnectOptions: wcOptions,
        genesis: 'main',
        customWcModal: undefined,
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
        it('add disconnected listener', () => {
            const walletManager = newWalletManager();

            walletManager.onDisconnected(listener);
            expect(eventNames(walletManager)).toEqual(['disconnected']);
        });

        it('can remove disconnected listener', () => {
            const walletManager = newWalletManager();
            walletManager.onDisconnected(listener);
            walletManager.removeOnDisconnected(listener);
            expect(eventNames(walletManager)).toEqual([]);
        });

        it('can add onSourceChanged listener', () => {
            const walletManager = newWalletManager();
            walletManager.onSourceChanged(listener);
            expect(eventNames(walletManager)).toEqual(['source-changed']);
        });

        it('can remove onSourceChanged listener', () => {
            const walletManager = newWalletManager();
            walletManager.onSourceChanged(listener);
            walletManager.removeOnSourceChanged(listener);
            expect(eventNames(walletManager)).toEqual([]);
        });
    });
});
