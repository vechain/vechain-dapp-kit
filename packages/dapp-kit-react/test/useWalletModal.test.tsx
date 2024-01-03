import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useWalletModal } from '../src';
import { wrapper } from './helpers/react-test-helpers';

describe('useWalletModal', () => {
    it('should be able to open the modal', async () => {
        const { result } = renderHook(() => useWalletModal(), { wrapper });

        expect(result.current).toBeDefined();

        result.current.open();

        await waitFor(
            () => {
                const modalHtml = window.document.body
                    .querySelector('vwk-button')
                    ?.shadowRoot?.querySelector('vwk-connect-button-with-modal')
                    ?.shadowRoot?.querySelector('vwk-connect-modal')
                    ?.shadowRoot?.innerHTML;

                expect(modalHtml).toBeDefined();

                expect(modalHtml).toContain('Connect Wallet');
            },
            { timeout: 5000 },
        );

        result.current.close();
    });
});
