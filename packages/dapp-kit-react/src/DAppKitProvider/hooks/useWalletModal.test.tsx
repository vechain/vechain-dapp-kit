import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useWalletModal } from '../..';
import { wrapper } from '../../../test/helpers/react-test-helpers';

describe('useWalletModal', () => {
    it('should be able to open the modal', async () => {
        const { result } = renderHook(() => useWalletModal(), { wrapper });

        expect(result.current).toBeDefined();

        result.current.open();

        await waitFor(
            () => {
                const modalHtml = window.document.body
                    .querySelector('vdk-modal')
                    ?.shadowRoot?.querySelector('vdk-connect-modal')
                    ?.shadowRoot?.innerHTML;

                expect(modalHtml).toBeDefined();

                expect(modalHtml).toContain('Connect Wallet');
            },
            { timeout: 5000 },
        );

        result.current.close();
    });
    it('should throw an error when used outside of DAppKitProvider', () => {
        expect(() => renderHook(() => useWalletModal())).toThrow(
            '"useWalletModal" must be used within a ConnexProvider',
        );
    });
});