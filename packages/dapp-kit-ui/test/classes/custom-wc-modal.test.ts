import { describe, expect, it } from 'vitest';
import { CustomWalletConnectModal } from '../../src';

describe('CustomWalletConnectModal', () => {
    it('should be a singleton', () => {
        const modal = CustomWalletConnectModal.getInstance();
        const modal2 = CustomWalletConnectModal.getInstance();

        expect(modal).toBe(modal2);
    });

    it('should not throw', () => {
        const modal = CustomWalletConnectModal.getInstance();

        modal.closeModal();
        modal.askForConnectionCertificate();
        modal.onConnectionCertificateSigned();

        modal.subscribeModal((newState) => {
            // eslint-disable-next-line no-console
            console.log(newState);
        });
    });
});
