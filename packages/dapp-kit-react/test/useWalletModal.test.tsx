import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useWalletModal } from '../src';
import { wrapper } from './helpers/react-test-helpers';

describe('useWalletModal', () => {
    it('should be able to open the modal', async () => {
        const { result } = renderHook(() => useWalletModal(), { wrapper });

        expect(result.current).toBeDefined();

        result.current.open();

        await waitFor(() => {
            const modal = window.document.querySelector('vwk-connect-modal');

            expect(modal).toBeDefined();
        });
    });
});
