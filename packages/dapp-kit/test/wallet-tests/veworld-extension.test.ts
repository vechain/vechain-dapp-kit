import { beforeEach, expect } from 'vitest';
import { mockedConnexSigner } from '../helpers/mocked-signer';
import { createUnitTestDAppKit } from '../helpers/connex-helper';

describe('veworld', () => {
    describe('is in veworld browser', () => {
        beforeEach(() => {
            window.vechain = {
                newConnexSigner: () => mockedConnexSigner,
            };
        });

        it('should connect', async () => {
            const connex = createUnitTestDAppKit();

            connex.wallet.setSource('veworld');

            const res = await connex.wallet.connect();

            expect(res.verified).toBe(true);
        });

        it('can disconnect', async () => {
            const connex = createUnitTestDAppKit();

            connex.wallet.setSource('veworld');

            await connex.wallet.disconnect();

            const currentSource = connex.wallet.state.source;

            expect(currentSource).toBe(null);
        });

        it('get available sources - should include veworld', () => {
            const connex = createUnitTestDAppKit();

            const sources = connex.wallet.state.availableSources;

            expect(sources).toContain('veworld');
        });
    });
});
