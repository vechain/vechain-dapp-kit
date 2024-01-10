import type { WalletManager, WalletSource } from '@vechain/dapp-kit';
import { DAppKitLogger } from '@vechain/dapp-kit';
import { subscribeKey } from 'valtio/vanilla/utils';
import { createModalIfNotPresent, dispatchCustomEvent } from '../utils';

export interface ConnectModalManagerOptions {
    modalParent?: HTMLElement;
}

export class ConnectModalManager {
    private static instance: ConnectModalManager | null = null;

    private constructor(
        private walletManager: WalletManager,
        options?: ConnectModalManagerOptions,
    ) {
        createModalIfNotPresent(options);
    }

    public static getInstance(
        walletManager: WalletManager,
        options?: ConnectModalManagerOptions,
    ): ConnectModalManager {
        if (!ConnectModalManager.instance) {
            ConnectModalManager.instance = new ConnectModalManager(
                walletManager,
                options,
            );
        }

        return ConnectModalManager.instance;
    }

    open(): void {
        DAppKitLogger.debug('ConnectModalManager', 'opening the modal');
        dispatchCustomEvent('vdk-open-wallet-modal');
    }

    close(): void {
        DAppKitLogger.debug('ConnectModalManager', 'closing the modal');
        dispatchCustomEvent('vdk-close-wallet-modal');
    }

    closeWalletConnect(): void {
        DAppKitLogger.debug('ConnectModalManager', 'closing wallet connect');
        dispatchCustomEvent('vdk-close-wc-qrcode');
    }

    closeConnectionCertificateRequest(): void {
        DAppKitLogger.debug(
            'ConnectModalManager',
            'closing connection certificate request',
        );
        dispatchCustomEvent('vdk-close-connection-certificate-request');
    }

    onConnectionStatusChange(
        callback: (address: string | null) => void,
    ): () => void {
        return subscribeKey(this.walletManager.state, 'address', (address) => {
            callback(address);
        });
    }

    onWalletSelected(
        callback: (source: WalletSource | null) => void,
    ): () => void {
        return subscribeKey(this.walletManager.state, 'source', (source) => {
            callback(source);
        });
    }
}
