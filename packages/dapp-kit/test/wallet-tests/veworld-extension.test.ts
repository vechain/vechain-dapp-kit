import { beforeEach, expect } from 'vitest';
import { mockedConnexSigner } from '../helpers/mocked-signer';
import { createUnitTestConnex } from '../helpers/connex-helper';
import { ExpandedConnexSigner } from '../../src/types/types';

describe('veworld', () => {
    describe('is in veworld browser', () => {
        beforeEach(() => {
            window.vechain = {
                newConnexSigner: (): ExpandedConnexSigner => mockedConnexSigner,
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
});
