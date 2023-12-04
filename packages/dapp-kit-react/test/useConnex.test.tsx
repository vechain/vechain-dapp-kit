import { describe, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useConnex } from '../src';
import { wrapper } from './helpers/react-test-helpers';

describe('useConnex', () => {
    it('connex should get initialised', () => {
        const { result } = renderHook(() => useConnex(), { wrapper });

        expect(result.current).toBeDefined();

        expect(result.current.thor.genesis.id).toBe(
            '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a',
        );
    });
});
