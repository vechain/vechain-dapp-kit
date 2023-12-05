import { beforeEach, describe, expect, it } from 'vitest';
import { DAppKitUI } from '../src';
import { waitFor } from '@testing-library/react';

describe('DAppKitModal', () => {
    beforeEach(() => {
        DAppKitUI.configure({ nodeUrl: 'https://mainnet.vechain.org/' });
    });

    it('should create an element', () => {
        const existing = document.querySelector('vwk-connect-modal');

        expect(existing).toBe(null);

        DAppKitUI.modal.open();

        waitFor(() => {
            const element = document.querySelector('vwk-connect-modal');

            expect(element).not.toBe(null);
            expect(element?.open).toBe(true);
        });

        DAppKitUI.modal.close();

        waitFor(() => {
            const element = document.querySelector('vwk-connect-modal');

            expect(element).not.toBe(null);
            expect(element?.open).toBe(false);
        });
    });
});
