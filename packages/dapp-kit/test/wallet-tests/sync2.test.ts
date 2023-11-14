import { expect, vi } from 'vitest';
import { mockedConnexSigner } from '../helpers/mocked-signer';
import { createUnitTestConnex } from '../helpers/connex-helper';

vi.mock('@vechain/connex/esm/signer', () => {
    return {
        createSync2: (): Promise<Connex.Signer> =>
            Promise.resolve(mockedConnexSigner),
    };
});

describe('sync2', () => {
    it('should connect', async () => {
        const connex = createUnitTestConnex();

        connex.wallet.setSource('sync2');

        const res = await connex.wallet.connect();

        expect(res.verified).toBe(true);
    });

    it('is always available', () => {
        const connex = createUnitTestConnex();

        const sources = connex.wallet.getAvailableSources();

        expect(sources).toContain('sync2');
    });
});
