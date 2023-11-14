import { beforeEach, expect } from 'vitest';
import { mockedConnexSigner } from '../helpers/mocked-signer';
import { createUnitTestConnex } from '../helpers/connex-helper';

describe('veworld-extension', () => {
    describe('is in veworld-extension browser', () => {
        beforeEach(() => {
            window.vechain = {
                newConnexSigner: (): Connex.Signer => mockedConnexSigner,
            };
        });

        it('should connect', async () => {
            const connex = createUnitTestConnex();

            connex.wallet.setSource('veworld-extension');

            const res = await connex.wallet.connect();

            expect(res.verified).toBe(true);
        });

        it('can disconnect', async () => {
            const connex = createUnitTestConnex();

            connex.wallet.setSource('veworld-extension');

            await connex.wallet.disconnect();

            const currentSource = connex.wallet.getSource();

            expect(currentSource).toBe(null);
        });

        it('get available sources - should include veworld-extension', () => {
            const connex = createUnitTestConnex();

            const sources = connex.wallet.getAvailableSources();

            expect(sources).toContain('veworld-extension');
        });
    });

    describe('is NOT in veworld-extension browser', () => {
        beforeEach(() => {
            window.vechain = undefined;
        });

        it('not installed - should throw error', () => {
            const connex = createUnitTestConnex();

            expect(() =>
                connex.wallet.setSource('veworld-extension'),
            ).toThrowError('VeWorld Extension is not installed');
        });

        it('get available sources - should not include veworld-extension', () => {
            const connex = createUnitTestConnex();

            const sources = connex.wallet.getAvailableSources();

            expect(sources).not.toContain('veworld-extension');
        });
    });
});
