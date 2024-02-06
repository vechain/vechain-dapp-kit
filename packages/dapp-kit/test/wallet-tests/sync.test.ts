import { beforeEach, expect, vi } from 'vitest';
import { mockedConnexSigner } from '../helpers/mocked-signer';
import { createUnitTestConnex } from '../helpers/connex-helper';
import { genesisBlocks } from '../../src';
import { Connex } from '@vechain/connex';

vi.mock('@vechain/connex');

vi.mocked(Connex.Vendor).mockImplementation((): Connex.Vendor => {
    return {
        sign: ((
            type: string,
            msg: Connex.Vendor.TxMessage | Connex.Vendor.CertMessage,
        ) => {
            if (type === 'tx') {
                return {
                    request: () => {
                        return mockedConnexSigner.signTx(
                            msg as Connex.Vendor.TxMessage,
                            {},
                        );
                    },
                };
            } else {
                return {
                    request: () => {
                        return mockedConnexSigner.signCert(
                            msg as Connex.Vendor.CertMessage,
                            {},
                        );
                    },
                };
            }
        }) as any,
    };
});

describe('sync', () => {
    describe('is in sync browser', () => {
        beforeEach(() => {
            // @ts-ignore
            window.connex = {
                thor: {
                    genesis: genesisBlocks.main,
                },
                vendor: {
                    // @ts-ignore
                    sign: () => Promise.reject('Not implemented'),
                },
            };
        });

        it('window.connex is defined - should connect', async () => {
            const connex = createUnitTestConnex();

            connex.wallet.setSource('sync');

            const res = await connex.wallet.connect();

            expect(res.verified).toBe(true);
        });

        it('get available sources - should include sync', () => {
            const connex = createUnitTestConnex();

            const sources = connex.wallet.state.availableSources;

            expect(sources).toContain('sync');
        });
    });

    describe('is NOT in sync browser', () => {
        beforeEach(() => {
            window.connex = undefined;
        });

        it('window.connex not defined - should throw error', () => {
            const connex = createUnitTestConnex();

            expect(() => connex.wallet.setSource('sync')).toThrowError(
                'User is not in a Sync wallet',
            );
        });

        it('get available sources - should not include veworld', () => {
            const connex = createUnitTestConnex();

            const sources = connex.wallet.state.availableSources;

            expect(sources).not.toContain('sync');
        });
    });
});
