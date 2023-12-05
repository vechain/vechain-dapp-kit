import { describe, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { mockedConnexSigner } from '@vechain/dapp-kit/test/helpers/mocked-signer';
import { Connex } from '@vechain/connex';
import { useWallet } from '../src';
import { wrapper } from './helpers/react-test-helpers';

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
            }
            return {
                request: () => {
                    return mockedConnexSigner.signCert(msg, {});
                },
            };
        },
    };
});

describe('useWallet', () => {
    it('should be able to set the source', async () => {
        const { result } = renderHook(() => useWallet(), { wrapper });

        expect(result.current).toBeDefined();

        result.current.setSource('sync2');

        await waitFor(() => {
            expect(result.current.source).toBe('sync2');
        });
    });

    it('should be able to connect & disconnect', async () => {
        const { result } = renderHook(() => useWallet(), { wrapper });

        expect(result.current).toBeDefined();

        result.current.setSource('sync2');
        result.current.connect();

        await waitFor(() => {
            expect(result.current.source).toBe('sync2');
            expect(result.current.account).toBe(
                '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
            );
        });

        result.current.disconnect();

        await waitFor(() => {
            expect(result.current.source).toBe(null);
            expect(result.current.account).toBeNull();
        });
    });
});
