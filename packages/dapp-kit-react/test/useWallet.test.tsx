import { it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useWallet } from '../src';
import { wrapper } from './helpers/react-test-helpers';
import { mockedConnexSigner } from './helpers/mocked-signer';

window.vechain = {} as any;
window.vechain.newConnexSigner = () => mockedConnexSigner;

describe('useWallet', () => {
    it('should be able to set the source', async () => {
        const { result } = renderHook(() => useWallet(), { wrapper });

        expect(result.current).toBeDefined();

        result.current.setSource('veworld');

        await waitFor(() => {
            expect(result.current.source).toBe('veworld');
        });
    });

    it('should be able to connect & disconnect', async () => {
        const { result } = renderHook(() => useWallet(), { wrapper });

        expect(result.current).toBeDefined();

        result.current.setSource('veworld');
        result.current.connect().catch(() => {
            // ignore
        });

        await waitFor(() => {
            expect(result.current.source).toBe('veworld');
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
});
