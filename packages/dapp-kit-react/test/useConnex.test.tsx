import { describe, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { wrapper } from './helpers/react-test-helpers';
import { useSDK } from '../src';

describe('useSDK', () => {
    it('SDK should get initialised', () => {
        const { result } = renderHook(() => useSDK(), { wrapper });

        expect(result.current).toBeDefined();

        expect(result.current.thor.httpClient.baseURL).toBe(
            'https://testnet.vechain.org',
        );
    });
});
