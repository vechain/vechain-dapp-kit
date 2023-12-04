import { renderHook, waitFor } from '@testing-library/react';
import { useContext } from 'react';
import { describe, expect, it } from 'vitest';
import { ThemeContext } from '../../src/provider/ThemeProvider';
import { wrapper } from '../helpers/react-test-helpers';

describe('useThemeContext', () => {
    it('should be able to toggle themes', async () => {
        const { result } = renderHook(() => useContext(ThemeContext), {
            wrapper,
        });

        expect(result.current).toBeDefined();

        expect(result.current?.theme).toEqual({ mode: 'LIGHT' });

        result.current?.toggleTheme();

        await waitFor(
            () => {
                expect(result.current?.theme).toEqual({ mode: 'DARK' });
            },
            { timeout: 3000 },
        );
    });
});
