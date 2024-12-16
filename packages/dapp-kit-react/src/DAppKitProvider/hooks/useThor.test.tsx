import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useThor } from '../..';
import { wrapper } from '../../../test';

describe('useConnex', () => {
    it('connex should get initialised', () => {
        const { result } = renderHook(() => useThor(), { wrapper });

        expect(result.current).toBeDefined();
        expect(result.current.thor.genesis.id).toBe(
            '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a',
        );
    });

    it('should throw an error when used outside of DAppKitProvider', () => {
        expect(() => renderHook(() => useThor())).toThrow(
            '"useConnex" must be used within a ConnexProvider',
        );
    });
});
