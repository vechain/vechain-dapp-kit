import { describe, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useWallet } from '../src';
import { wrapper } from './helpers/react-test-helpers';

describe('useWallet', () => {
    it('should be able to set the source', async () => {
        const { result } = renderHook(() => useWallet(), { wrapper });

        expect(result.current).toBeDefined();

        result.current.setSource('sync2');

        await waitFor(() => {
            expect(result.current.source).toBe('sync2');
        });
    });
});
