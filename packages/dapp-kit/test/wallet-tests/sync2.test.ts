import { expect, vi } from 'vitest';
import { createUnitTestConnex } from '../helpers/connex-helper';
import { Connex } from '@vechain/connex';
import { mockedConnexSigner } from '../helpers/mocked-signer';

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

describe('sync2', () => {
    it('should connect', async () => {
        const connex = createUnitTestConnex();

        connex.wallet.setSource('sync2');

        const res = await connex.wallet.connect();

        expect(res.verified).toBe(true);
    });

    it('is always available', () => {
        const connex = createUnitTestConnex();

        const sources = connex.wallet.state.availableSources;

        expect(sources).toContain('sync2');
    });
});
