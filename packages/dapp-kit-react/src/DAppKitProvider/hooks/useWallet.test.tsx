import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { mockedConnexSigner } from '@vechain/dapp-kit/test/helpers/mocked-signer';
import { Connex } from '@vechain/connex';
import { useWallet } from '../..';
import { wrapper } from '../../../test/helpers/react-test-helpers';

vi.mock('@vechain/connex');

vi.mocked(Connex.Vendor).mockImplementation((): Connex.Vendor => {
    return {
        // @ts-ignore
        sign: (type, msg) => {
            if (type === 'tx') {
                return {
                    request: () => {
                        // @ts-ignore
                        return mockedConnexSigner.signTx(msg, {});
                    },
                };
            }
            return {
                request: () => {
                    // @ts-ignore
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
        await result.current.connect();

        await waitFor(() => {
            expect(result.current.source).toBe('sync2');
            expect(result.current.account).toBe(
                '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
            );
        });

        result.current.disconnect();

        await waitFor(() => {
            expect(result.current.source).toBe(null);
            expect(result.current.account).toBeNull();
        });
    });

    it('should throw an error when used outside of DAppKitProvider', () => {
        expect(() => renderHook(() => useWallet())).toThrow(
            '"useWallet" must be used within a ConnexProvider',
        );
    });
});
