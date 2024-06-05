import { beforeEach, expect, vi } from 'vitest';
import { mockedConnexSigner } from '../helpers/mocked-signer';
import { createUnitTestDAppKit } from '../helpers/connex-helper';
import { genesisBlocks } from '../../src';
import { createSync } from '../../src/utils/sync-signers';

vi.mock('../../src/utils/sync-signers');

vi.mocked(createSync).mockImplementation(() => {
    return Promise.resolve(mockedConnexSigner);
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
            const connex = createUnitTestDAppKit();

            connex.wallet.setSource('sync');

            const res = await connex.wallet.connect();

            expect(res.verified).toBe(true);
        });

        it('get available sources - should include sync', () => {
            const connex = createUnitTestDAppKit();

            const sources = connex.wallet.state.availableSources;

            expect(sources).toContain('sync');
        });
    });

    describe('is NOT in sync browser', () => {
        beforeEach(() => {
            window.connex = undefined;
        });

        it('window.connex not defined - should throw error', () => {
            const connex = createUnitTestDAppKit();

            expect(() => connex.wallet.setSource('sync')).toThrowError(
                'User is not in a Sync wallet',
            );
        });

        it('get available sources - should not include sync', () => {
            const connex = createUnitTestDAppKit();

            const sources = connex.wallet.state.availableSources;

            expect(sources).not.toContain('sync');
        });
    });
});
