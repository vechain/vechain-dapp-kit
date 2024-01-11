import { EventEmitter } from 'events';
import type {
    OpenOptions,
    SubscribeModalState,
    WCModal,
} from '@vechain/dapp-kit';
import { DAppKitLogger } from '@vechain/dapp-kit';
import { dispatchCustomEvent, subscribeToCustomEvent } from '../utils';

const MODAL_STATE_EVENT = 'vdk-modal-state-change';

export class CustomWalletConnectModal implements WCModal {
    private static instance: CustomWalletConnectModal | null = null;

    private eventEmitter = new EventEmitter();

    private constructor() {
        subscribeToCustomEvent('vdk-close-wc-qrcode', () => {
            this.updateModalState({ open: false });
        });
        subscribeToCustomEvent('vdk-open-wc-qrcode', () => {
            this.updateModalState({ open: true });
        });
    }

    static getInstance(): CustomWalletConnectModal {
        if (!CustomWalletConnectModal.instance) {
            CustomWalletConnectModal.instance = new CustomWalletConnectModal();
        }

        return CustomWalletConnectModal.instance;
    }

    /**
     * WalletConnect
     */
    openModal(options: OpenOptions): Promise<void> {
        DAppKitLogger.debug('CustomWalletConnectModal', 'opening the wc modal');
        dispatchCustomEvent('vdk-open-wc-qrcode', options);
        return Promise.resolve();
    }

    closeModal(): void {
        DAppKitLogger.debug('CustomWalletConnectModal', 'closing the modal');
        dispatchCustomEvent('vdk-close-wc-qrcode');
    }

    askForConnectionCertificate(): void {
        DAppKitLogger.debug(
            'CustomWalletConnectModal',
            'ask for connection certificate',
        );
        dispatchCustomEvent('vdk-close-wc-qrcode');
        dispatchCustomEvent('vdk-request-connection-certificate');
    }

    onConnectionCertificateSigned(): void {
        DAppKitLogger.debug(
            'CustomWalletConnectModal',
            'connection certificate signed',
        );
        dispatchCustomEvent('vdk-close-wallet-modal');
        dispatchCustomEvent('vdk-close-wc-qrcode');
        dispatchCustomEvent('vdk-close-connection-certificate-request');
    }

    subscribeModal(
        callback: (newState: SubscribeModalState) => void,
    ): () => void {
        DAppKitLogger.debug(
            'CustomWalletConnectModal',
            'subscribing to modal state',
        );

        this.eventEmitter.on(MODAL_STATE_EVENT, callback);

        return () => {
            this.eventEmitter.off(MODAL_STATE_EVENT, callback);
        };
    }

    private updateModalState(state: SubscribeModalState): void {
        this.eventEmitter.emit(MODAL_STATE_EVENT, state);
    }
}
