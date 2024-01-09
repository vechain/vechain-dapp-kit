// eslint-disable-next-line unicorn/prefer-node-protocol
import { EventEmitter } from 'events';
import type {
    OpenOptions,
    SubscribeModalState,
    WalletManager,
    WalletSource,
    WCModal,
} from '@vechain/dapp-kit';
import { DAppKitLogger } from '@vechain/dapp-kit';
import { subscribeKey } from 'valtio/vanilla/utils';
import { dispatchCustomEvent, subscribeToCustomEvent } from './utils';

const MODAL_STATE_EVENT = 'vdk-modal-state-change';

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

class CustomWalletConnectModal implements WCModal {
    private static instance: CustomWalletConnectModal | null = null;

    private eventEmitter = new EventEmitter();

    private constructor() {
        subscribeToCustomEvent('vdk-close-wc-modal', () => {
            this.updateModalState({ open: false });
        });
        subscribeToCustomEvent('vdk-open-wc-modal', () => {
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
        dispatchCustomEvent('vdk-open-wc-modal', options);
        return Promise.resolve();
    }

    closeModal(): void {
        DAppKitLogger.debug('CustomWalletConnectModal', 'closing the modal');
        dispatchCustomEvent('vdk-close-wc-modal');
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
        dispatchCustomEvent('vdk-close-wc-modal');
    }

    onConnected(callback: (address: string | null) => void): () => void {
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

export { CustomWalletConnectModal };
