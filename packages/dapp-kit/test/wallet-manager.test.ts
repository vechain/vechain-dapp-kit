import { TESTNET_NETWORK } from '@vechain/sdk-core';
import { ThorClient, VeChainPrivateKeySigner } from '@vechain/sdk-network';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { DAppKitOptions } from '../src';
import { CertificateBasedWallet, createWallet, WalletManager } from '../src';
import {
    address,
    mockedConnexSigner,
    privateKey,
} from './helpers/mocked-signer';
import { certMessage, typedDataMessage } from './helpers/request-data';

const newWalletManager = (options?: Partial<DAppKitOptions>): WalletManager => {
    return new WalletManager(
        {
            node: 'https://testnet.veblocks.net/',
            genesisId: TESTNET_NETWORK.genesisBlock.id,
            v2Api: {
                enabled: false,
            },
            ...options,
        },
        ThorClient.at('https://testnet.vechain.org'),
    );
};

window.vechain = {} as any;
vi.mock('../src/utils/create-wallet', async (importOriginal) => ({
    ...(await importOriginal()),
    createWallet: vi.fn(),
}));

const mockDefaultWallet = () => {
    vi.mocked(createWallet).mockImplementation(
        (args) =>
            new CertificateBasedWallet(
                mockedConnexSigner,
                null,
                args.genesisId,
                undefined,
            ),
    );
};

describe('WalletManager', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });
    describe('setSource', () => {
        it('no wc options provided', () => {
            mockDefaultWallet();
            const walletManager = newWalletManager();
            expect(() => {
                walletManager.setSource('wallet-connect');
            }).toThrowError('WalletConnect options are not provided');
        });
    });

    describe('connect', () => {
        it('no source set', async () => {
            mockDefaultWallet();
            const walletManager = newWalletManager();
            await expect(() => walletManager.connect()).rejects.toThrow(
                'No wallet selected',
            );
        });
        it('connect with custom message', async () => {
            mockDefaultWallet();
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

    describe.only('connectV2', () => {
        it.each([
            { kind: 'simple', value: null },
            { kind: 'certificate', value: certMessage },
            { kind: 'typed-data', value: typedDataMessage },
        ])('VeWorld with new methods. Kind: $kind', async ({ value }) => {
            const sendFn = vi.fn().mockImplementation(({ method, params }) => {
                switch (method) {
                    case 'thor_methods':
                        return ['thor_connect', 'thor_wallet'];
                    case 'thor_wallet':
                        return address.toString();
                    case 'thor_connect': {
                        if (params.value === null)
                            return { signer: address.toString() };
                        if ('purpose' in params.value)
                            return { annex: { signer: address.toString() } };
                        else return { signer: address.toString() };
                    }
                }
            });
            vi.mocked(createWallet).mockImplementation(
                (args) =>
                    new CertificateBasedWallet(
                        mockedConnexSigner,
                        { send: sendFn },
                        args.genesisId,
                        undefined,
                    ),
            );
            const walletManager = newWalletManager({
                v2Api: { enabled: true },
            });
            await walletManager.initializeStateAsync();
            const subscription = vi.fn();

            walletManager.subscribe(subscription);
            walletManager.setSource('veworld');

            //Poll since it's an async OP started from a sync function
            await expect
                .poll(() => subscription)
                .toHaveBeenNthCalledWith(
                    2,
                    expect.objectContaining({
                        availableMethods: ['thor_connect', 'thor_wallet'],
                    }),
                );

            await walletManager.connectV2(value);

            expect(subscription).toHaveBeenNthCalledWith(
                3,
                expect.objectContaining({
                    availableMethods: ['thor_connect', 'thor_wallet'],
                }),
            );
            expect(subscription).toHaveBeenNthCalledWith(
                4,
                expect.objectContaining({ address: address.toString() }),
            );
        });

        it.each([
            { kind: 'simple', value: null },
            { kind: 'certificate', value: certMessage },
            { kind: 'typed-data', value: typedDataMessage },
        ])('VeWorld with old methods. Kind: $kind', async ({ value }) => {
            vi.mocked(createWallet).mockImplementation(
                (args) =>
                    new CertificateBasedWallet(
                        {
                            ...mockedConnexSigner,
                            signTypedData(domain, types, message) {
                                return new VeChainPrivateKeySigner(
                                    privateKey,
                                ).signTypedData(domain, types, message);
                            },
                        },
                        null,
                        args.genesisId,
                        undefined,
                    ),
            );
            const walletManager = newWalletManager({
                v2Api: { enabled: true },
            });
            await walletManager.initializeStateAsync();
            const subscription = vi.fn();

            walletManager.subscribe(subscription);
            walletManager.setSource('veworld');

            //Poll since it's an async OP started from a sync function
            await expect
                .poll(() => subscription)
                .toHaveBeenNthCalledWith(
                    2,
                    expect.objectContaining({ availableMethods: [] }),
                );

            const result = await walletManager.connectV2(value);

            expect(subscription).toHaveBeenNthCalledWith(
                3,
                expect.objectContaining({ address: address.toString() }),
            );
            expect(subscription).toHaveBeenNthCalledWith(
                4,
                expect.objectContaining({ availableMethods: [] }),
            );

            if (value === null)
                expect((result as any).signer).toBe(address.toString());
            else if ('purpose' in value)
                expect((result as any).annex.signer).toBe(address.toString());
            else expect((result as any).signer).toBe(address.toString());
        });
    });

    describe('signTx', () => {
        it('should sign the tx', async () => {
            mockDefaultWallet();
            const walletManager = newWalletManager();
            walletManager.setSource('veworld');
            const res = await walletManager.signTx([], {});

            expect(res.txid).toBeDefined();
        });
    });

    describe('signCert', () => {
        it('should sign the cert', async () => {
            mockDefaultWallet();
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
            mockDefaultWallet();
            const walletManager = newWalletManager();

            await walletManager.disconnect();

            expect(walletManager.state.source).toEqual(null);
        });

        it('from remote', async () => {
            mockDefaultWallet();
            const walletManager = newWalletManager();

            walletManager.setSource('veworld');

            await walletManager.disconnect(true);

            expect(walletManager.state.source).toEqual(null);
        });
    });

    describe('listeners', () => {
        it('add state listener', async () => {
            mockDefaultWallet();
            const walletManager = newWalletManager();

            const subscription = vi.fn();

            walletManager.subscribe(subscription);

            walletManager.setSource('veworld');

            await new Promise((resolve) => setTimeout(resolve, 2000));

            expect(subscription).toHaveBeenCalledTimes(2);
        });

        it('add key listener', async () => {
            mockDefaultWallet();
            const walletManager = newWalletManager();

            const subscription = vi.fn();

            walletManager.subscribeToKey('source', subscription);

            walletManager.setSource('veworld');

            await new Promise((resolve) => setTimeout(resolve, 2000));

            expect(subscription).toHaveBeenCalledTimes(1);
        });
    });
});
