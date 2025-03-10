import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useVechainDomain } from '../../../src';
import { wrapper } from '../../helpers';

vi.mock('../../../src/hooks/useVechainDomain/api/getDomain', () => ({
    getDomain: vi.fn().mockImplementation(({ address }) => {
        if (address === '0x1234567890123456789012345678901234567890') {
            return Promise.resolve('test.vet');
        }
        if (address === '0xERROR') {
            return Promise.reject(new Error('Network error'));
        }
        if (address === '0x0000000000000000000000000000000000000000') {
            return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve(null);
    }),
}));

vi.mock('../../../src/hooks/useVechainDomain/api/getAddress', () => ({
    getAddress: vi.fn().mockImplementation(({ domain }) => {
        if (domain === 'test.vet') {
            return Promise.resolve(
                '0x1234567890123456789012345678901234567890',
            );
        }
        if (domain === 'invalid.vet') {
            return Promise.resolve(
                '0x0000000000000000000000000000000000000000',
            );
        }
        if (domain === 'error.vet' || domain === '0xERROR') {
            return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve(null);
    }),
}));

describe('useVechainDomain', () => {
    it('should return initial state', async () => {
        const { result } = renderHook(
            () => useVechainDomain({ addressOrDomain: null }),
            {
                wrapper,
            },
        );
        await waitFor(() => {
            expect(result.current).toEqual({
                address: undefined,
                domain: undefined,
                isLoading: false,
                isValidAddressOrDomain: false,
            });
        });
    });

    it('should handle valid address input', async () => {
        const { result } = renderHook(
            () =>
                useVechainDomain({
                    addressOrDomain:
                        '0x1234567890123456789012345678901234567890',
                }),
            { wrapper },
        );

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current).toEqual({
                address: '0x1234567890123456789012345678901234567890',
                domain: 'test.vet',
                isLoading: false,
                isValidAddressOrDomain: true,
            });
        });
    });

    it('should handle valid domain input', async () => {
        const { result } = renderHook(
            () => useVechainDomain({ addressOrDomain: 'test.vet' }),
            {
                wrapper,
            },
        );

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current).toEqual({
                address: '0x1234567890123456789012345678901234567890',
                domain: 'test.vet',
                isLoading: false,
                isValidAddressOrDomain: true,
            });
        });
    });

    it('should handle invalid domain input', async () => {
        const { result } = renderHook(
            () => useVechainDomain({ addressOrDomain: 'invalid.vet' }),
            {
                wrapper,
            },
        );

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current).toEqual({
                address: undefined,
                domain: undefined,
                isLoading: false,
                isValidAddressOrDomain: false,
            });
        });
    });

    it('should handle error when getting domain', async () => {
        const { result } = renderHook(
            () => useVechainDomain({ addressOrDomain: '0xERROR' }),
            {
                wrapper,
            },
        );

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current).toEqual({
                address: undefined,
                domain: undefined,
                isLoading: false,
                isValidAddressOrDomain: false,
            });
        });
    });

    it('should handle error when getting address', async () => {
        const { result } = renderHook(
            () => useVechainDomain({ addressOrDomain: 'error.vet' }),
            {
                wrapper,
            },
        );

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current).toEqual({
                address: undefined,
                domain: undefined,
                isLoading: false,
                isValidAddressOrDomain: false,
            });
        });
    });
    it('should handle error when getting zero address', async () => {
        const { result } = renderHook(
            () =>
                useVechainDomain({
                    addressOrDomain:
                        '0x0000000000000000000000000000000000000000',
                }),
            {
                wrapper,
            },
        );

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current).toEqual({
                address: '0x0000000000000000000000000000000000000000',
                domain: undefined,
                isLoading: false,
                isValidAddressOrDomain: true,
            });
        });
    });
});
