import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { wrapper } from './helpers/react-test-helpers';
import { useThor } from '../src';

describe('useSDK', () => {
    it('SDK should get initialised', () => {
        const { result } = renderHook(() => useThor(), { wrapper });

        expect(result.current).toBeDefined();
    });
});
