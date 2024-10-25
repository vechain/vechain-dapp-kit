import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useVechainDomain } from './useVechainDomain';
import { wrapper } from '../../../test/helpers/react-test-helpers';
import { getDomain } from './api/getDomain';
import { getAddress } from './api/getAddress';

// Mock the useConnex hook
vi.mock('../../hooks/useConnex');

vi.mock('./api/getDomain', () => ({
    getDomain: vi.fn(),
}));

vi.mock('./api/getAddress', () => ({
    getAddress: vi.fn(),
}));

describe('useVechainDomain', () => {
    it('should return null values when addressOrDomain is falsy', () => {
        const { result } = renderHook(
            () => useVechainDomain({ addressOrDomain: null }),
            { wrapper },
        );

        expect(result.current).toEqual({
            address: null,
            domain: null,
            isLoading: false,
        });
    });

    it('should fetch domain when given a valid address', async () => {
        const mockAddress = '0x1234567890123456789012345678901234567890';
        const mockDomain = 'test.vet';

        vi.mocked(getDomain).mockResolvedValue(mockDomain);

        const { result } = renderHook(
            () => useVechainDomain({ addressOrDomain: mockAddress }),
            { wrapper },
        );

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current).toEqual({
                address: mockAddress,
                domain: mockDomain,
                isLoading: false,
            });
        });

        expect(getDomain).toHaveBeenCalledWith({
            address: mockAddress,
            connex: expect.anything(),
        });
    });

    it('should fetch address when given a valid domain', async () => {
        const mockAddress = '0x1234567890123456789012345678901234567890';
        const mockDomain = 'test.vet';

        vi.mocked(getAddress).mockResolvedValue(mockAddress);

        const { result } = renderHook(
            () => useVechainDomain({ addressOrDomain: mockDomain }),
            { wrapper },
        );

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current).toEqual({
                address: mockAddress,
                domain: mockDomain,
                isLoading: false,
            });
        });

        expect(getAddress).toHaveBeenCalledWith({
            domain: mockDomain,
            connex: expect.anything(),
        });
    });

    it('should handle errors when fetching domain', async () => {
        const mockAddress = '0x1234567890123456789012345678901234567890';

        vi.mocked(getDomain).mockRejectedValue(
            new Error('Failed to fetch domain'),
        );

        const { result } = renderHook(
            () => useVechainDomain({ addressOrDomain: mockAddress }),
            { wrapper },
        );

        await waitFor(() => {
            expect(result.current).toEqual({
                address: mockAddress,
                domain: null,
                isLoading: false,
            });
        });
    });

    it('should handle errors when fetching address', async () => {
        const mockDomain = 'test.vet';

        vi.mocked(getAddress).mockRejectedValue(
            new Error('Failed to fetch address'),
        );

        const { result } = renderHook(
            () => useVechainDomain({ addressOrDomain: mockDomain }),
            { wrapper },
        );

        await waitFor(() => {
            expect(result.current).toEqual({
                address: null,
                domain: null,
                isLoading: false,
            });
        });
    });
});
