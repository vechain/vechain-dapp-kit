import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { mockedConnexSigner, wrapper } from '../../index';
import { useWallet } from '../../../src';

window.vechain = {} as any;
window.vechain = {
    newConnexSigner: () => mockedConnexSigner,
};

describe('useWallet', () => {
    it('should be able to set the source', async () => {
        const { result } = renderHook(() => useWallet(), { wrapper });

        expect(result.current).toBeDefined();

        result.current.setSource('veworld');

        await waitFor(() => {
            expect(result.current.source).toBe('veworld');
        });
    });

    it(
        'should be able to connect & disconnect',
        async () => {
            const { result } = renderHook(() => useWallet(), { wrapper });

            expect(result.current).toBeDefined();

            result.current.setSource('veworld');
            result.current.connect().catch(() => {
                // ignore
            });

            await waitFor(
                () => {
                    expect(result.current.source).toBe('veworld');
                    expect(result.current.account).toBe(
                        '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
                    );
                },
                { timeout: 10_000 },
            );

            result.current.disconnect();

            await waitFor(
                () => {
                    expect(result.current.source).toBe(null);
                    expect(result.current.account).toBeNull();
                },
                { timeout: 10_000 },
            );
        },
        { timeout: 20_000 },
    );

    it('should throw an error when used outside of DAppKitProvider', () => {
        expect(() => renderHook(() => useWallet())).toThrow(
            '"useWallet" must be used within a DAppKitProvider',
        );
    });
});
