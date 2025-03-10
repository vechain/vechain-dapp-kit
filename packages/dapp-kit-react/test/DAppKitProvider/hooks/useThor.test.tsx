import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useThor } from '../../../src';
import { wrapper } from '../../index';

describe('useThor', () => {
    it('Thor should get initialised', async () => {
        const { result } = renderHook(() => useThor(), { wrapper });

        expect(result.current).toBeDefined();
        const genesisBlock = await result.current.blocks.getGenesisBlock();
        expect(genesisBlock?.id).toBe(
            '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
        );
    });

    it('should throw an error when used outside of DAppKitProvider', () => {
        expect(() => renderHook(() => useThor())).toThrow(
            '"useThor" must be used within a DAppKitProvider',
        );
    });
});
