import { beforeEach, expect } from 'vitest';
import { mockedConnexSigner } from '../helpers/mocked-signer';
import { createUnitTestConnex } from '../helpers/connex-helper';

describe('veworld', () => {
    describe('is in veworld browser', () => {
        beforeEach(() => {
            window.vechain = {
                newConnexSigner: (): Connex.Signer => mockedConnexSigner,
            };
        });

        it('should connect', async () => {
            const connex = createUnitTestConnex();

            connex.wallet.setSource('veworld');

            const res = await connex.wallet.connect();

            expect(res.verified).toBe(true);
        });

        it('can disconnect', async () => {
            const connex = createUnitTestConnex();

            connex.wallet.setSource('veworld');

            await connex.wallet.disconnect();

            const currentSource = connex.wallet.state.source;

            expect(currentSource).toBe(null);
        });

        it('get available sources - should include veworld', () => {
            const connex = createUnitTestConnex();

            const sources = connex.wallet.state.availableSources;

            expect(sources).toContain('veworld');
        });
    });

    describe('is NOT in veworld browser', () => {
        beforeEach(() => {
            window.vechain = undefined;
        });

        it('not installed - should throw error', () => {
            const connex = createUnitTestConnex();

            expect(() => connex.wallet.setSource('veworld')).toThrowError(
                'VeWorld Extension is not installed',
            );
        });

        it('get available sources - should not include veworld', () => {
            const connex = createUnitTestConnex();

            const sources = connex.wallet.state.availableSources;

            expect(sources).not.toContain('veworld');
        });
    });
});
