import { expect, vi } from 'vitest';
import { createUnitTestDAppKit } from '../helpers/connex-helper';
import { mockedConnexSigner } from '../helpers/mocked-signer';

import { createSync2 } from '../../src/utils/sync-signers';

vi.mock('../../src/utils/sync-signers');

vi.mocked(createSync2).mockImplementation(() => {
    return Promise.resolve(mockedConnexSigner);
});

describe('sync2', () => {
    it('should connect', async () => {
        const connex = createUnitTestDAppKit();

        connex.wallet.setSource('sync2');

        const res = await connex.wallet.connect();

        expect(res.verified).toBe(true);
    });

    it('is always available', () => {
        const connex = createUnitTestDAppKit();

        const sources = connex.wallet.state.availableSources;

        expect(sources).toContain('sync2');
    });
});
