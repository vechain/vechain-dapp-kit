import { beforeEach, expect, vi } from 'vitest';
import { mockedConnexSigner } from '../helpers/mocked-signer';
import { createUnitTestConnex } from '../helpers/connex-helper';

vi.mock('@vechain/connex/esm/signer', () => {
    return {
        createSync: (): Promise<Connex.Signer> =>
            Promise.resolve(mockedConnexSigner),
    };
});

describe('sync', () => {
    describe('is in sync browser', () => {
        beforeEach(() => {
            window.connex = {
                //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-expect-error
                test: 'hello world',
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

            const sources = connex.wallet.getAvailableSources();

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

        it('get available sources - should not include veworld-extension', () => {
            const connex = createUnitTestConnex();

            const sources = connex.wallet.getAvailableSources();

            expect(sources).not.toContain('sync');
        });
    });
});
