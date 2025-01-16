import { describe, expect, it, vi } from 'vitest';
import type { WalletConnectOptions } from '../src';
import { WalletManager } from '../src';
import { typedData } from './fixture';
import { mockedConnexSigner } from './helpers/mocked-signer';

const newWalletManager = (wcOptions?: WalletConnectOptions): WalletManager => {
    return new WalletManager(
        {
            nodeUrl: 'https://testnet.veblocks.net/',
            walletConnectOptions: wcOptions,
            genesis: 'test',
        },
        {} as any,
    );
};

window.vechain = {
    newConnexSigner: () => mockedConnexSigner,
};

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
        it('connect with custom message', async () => {
            const walletManager = newWalletManager();
            walletManager.setSource('veworld');
            await walletManager.connect({
                message: {
                    payload: {
                        type: 'text',
                        content: 'TEST1',
                    },
                    purpose: 'identification',
                },
            });

            expect(walletManager.state.connectionCertificate).toEqual(
                expect.objectContaining({
                    payload: {
                        type: 'text',
                        content: 'TEST1',
                    },
                }),
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

    describe('signTypedData', () => {
        it('should sign the typedData', async () => {
            const walletManager = newWalletManager();
            walletManager.setSource('veworld');
            const res = await walletManager.signTypedData(
                typedData.domain,
                typedData.types,
                typedData.value,
            );

            expect(res).toBeDefined();
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
