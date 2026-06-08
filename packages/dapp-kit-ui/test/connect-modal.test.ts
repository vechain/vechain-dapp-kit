import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConnectModal, DAppKitUI, type SourceInfo } from '../src';

const ACCOUNT = '0x1111111111111111111111111111111111111111';
const VEWORLD_SOURCE = { id: 'veworld' } as SourceInfo;

const createConnectModal = (): ConnectModal => {
    const modal = window.document.createElement(
        'vdk-connect-modal',
    ) as ConnectModal;
    window.document.body.appendChild(modal);
    return modal;
};

describe('vdk-connect-modal', () => {
    beforeEach(() => {
        window.document.body.innerHTML = '';
        Object.defineProperty(window, 'vechain', {
            configurable: true,
            value: { isInAppBrowser: false },
        });
        DAppKitUI.configure({
            node: 'https://mainnet.vechain.org/',
            v2Api: { enabled: false },
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        Object.defineProperty(window, 'vechain', {
            configurable: true,
            value: undefined,
        });
    });

    it('uses the certificate connection flow when v2Api is disabled', async () => {
        const modal = createConnectModal();
        const connect = vi
            .spyOn(DAppKitUI.wallet, 'connect')
            .mockResolvedValue({ account: ACCOUNT, verified: true });
        const connectV2 = vi.spyOn(DAppKitUI.wallet, 'connectV2');

        modal.onSourceClick(VEWORLD_SOURCE);
        await new Promise((resolve) => setTimeout(resolve));
        await modal.updateComplete;

        expect(connect).toHaveBeenCalledOnce();
        expect(connectV2).not.toHaveBeenCalled();
        expect(modal.requestForConnectionCertificate).toBe(true);
        expect(
            modal.shadowRoot?.querySelector('vdk-sign-connection-certificate'),
        ).toBeTruthy();
    });
});
