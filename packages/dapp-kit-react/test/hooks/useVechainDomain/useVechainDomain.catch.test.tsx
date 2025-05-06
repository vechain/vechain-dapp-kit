import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useVechainDomain } from '../../../src';
import { wrapper } from '../../helpers';

vi.mock('./api/fetchVechainDomain', () => ({
    ...vi.importActual('./api/fetchVechainDomain'),
    fetchVechainDomain: vi.fn().mockImplementation(async () => {
        throw new Error('Network error');
    }),
}));

describe('useVechainDomain error handling', () => {
    it(
        'should handle error when fetching domain',
        async () => {
            const { result } = renderHook(
                () => useVechainDomain({ addressOrDomain: 'test.vet' }),
                { wrapper },
            );

            expect(result.current.isLoading).toBe(true);

            await waitFor(
                () => {
                    expect(result.current).toEqual({
                        address: undefined,
                        domain: undefined,
                        isLoading: false,
                        isValidAddressOrDomain: false,
                    });
                },
                { timeout: 10_000 },
            );
        },
        { timeout: 12_000 },
    );
});
