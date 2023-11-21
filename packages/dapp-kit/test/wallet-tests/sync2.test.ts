import { expect, vi } from 'vitest';
import { createUnitTestConnex } from '../helpers/connex-helper';
import { Connex } from '@vechain/connex';
import { mockedConnexSigner } from '../helpers/mocked-signer';

vi.mock('@vechain/connex');

vi.mocked(Connex.Vendor).mockImplementation((): Connex.Vendor => {
    return {
        sign: (type, msg) => {
            if (type === 'tx') {
                return {
                    request: () => {
                        return mockedConnexSigner.signTx(msg, {});
                    },
                };
            } else {
                return {
                    request: () => {
                        return mockedConnexSigner.signCert(msg, {});
                    },
                };
            }
        },
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
