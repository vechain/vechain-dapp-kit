import { ConnectModalManager, DAppKitUI } from '../../src';
import { describe, expect, it } from 'vitest';

DAppKitUI.configure({
    node: 'https://mainnet.vechain.org/',
});

describe('ConnectModalManager', () => {
    it('should be a singleton', () => {
        const instance1 = ConnectModalManager.getInstance(DAppKitUI.wallet);
        const instance2 = ConnectModalManager.getInstance(DAppKitUI.wallet);
        expect(instance1).toBe(instance2);
    });

    it('should not throw', () => {
        const instance = ConnectModalManager.getInstance(DAppKitUI.wallet);
        instance.open();
        instance.close();
        instance.closeWalletConnect();
        instance.closeConnectionCertificateRequest();
    });
});
