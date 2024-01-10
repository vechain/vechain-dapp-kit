import type { WalletManager, WalletSource } from '@vechain/dapp-kit';
import { DAppKitLogger } from '@vechain/dapp-kit';
import { subscribeKey } from 'valtio/vanilla/utils';
import { dispatchCustomEvent } from '../utils';

const getModal = (): HTMLElement | null => document.querySelector('vdk-modal');

const createModalIfNotPresent = (options?: {
    modalParent?: HTMLElement;
}): HTMLElement => {
    const modal = getModal();

    if (modal) {
        return modal;
    }

    DAppKitLogger.debug('DAppKitModal', 'creating a new modal');

    const newModal = document.createElement('vdk-modal');

    (options?.modalParent ?? document.body).appendChild(newModal);

    return newModal;
};

export interface DAppKitModalOptions {
    modalParent?: HTMLElement;
}

export class DAppKitModal {
    private static instance: DAppKitModal | null = null;

    private constructor(
        private walletManager: WalletManager,
        options?: DAppKitModalOptions,
    ) {
        createModalIfNotPresent(options);
    }

    public static getInstance(
        walletManager: WalletManager,
        options?: DAppKitModalOptions,
    ): DAppKitModal {
        if (!DAppKitModal.instance) {
            DAppKitModal.instance = new DAppKitModal(walletManager, options);
        }

        return DAppKitModal.instance;
    }

    open(): void {
        DAppKitLogger.debug('DAppKitModal', 'opening the modal');
        dispatchCustomEvent('vdk-open-wallet-modal');
    }

    close(): void {
        DAppKitLogger.debug('DAppKitModal', 'closing the modal');
        dispatchCustomEvent('vdk-close-wallet-modal');
    }

    closeWalletConnect(): void {
        DAppKitLogger.debug('DAppKitModal', 'closing wallet connect');
        dispatchCustomEvent('vdk-close-wc-qrcode');
    }

    closeConnectionCertificateRequest(): void {
        DAppKitLogger.debug(
            'DAppKitModal',
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
