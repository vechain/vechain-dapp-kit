// eslint-disable-next-line unicorn/prefer-node-protocol
import { EventEmitter } from 'events';
import type {
    OpenOptions,
    SubscribeModalState,
    WCModal,
} from '@vechainfoundation/wallet-kit';
import { dispatchCustomEvent, subscribeToCustomEvent } from './utils/events';

const MODAL_STATE_EVENT = 'vwk-modal-state-change';

class CustomWalletConnectModal implements WCModal {
    private static instance: CustomWalletConnectModal | null = null;

    private eventEmitter = new EventEmitter();

    constructor() {
        subscribeToCustomEvent('vwk-close-wc-modal', () => {
            this.updateModalState({ open: false });
        });
        subscribeToCustomEvent('vwk-open-wc-modal', () => {
            this.updateModalState({ open: true });
        });
    }

    static getInstance(): CustomWalletConnectModal {
        if (!CustomWalletConnectModal.instance) {
            CustomWalletConnectModal.instance = new CustomWalletConnectModal();
        }

        return CustomWalletConnectModal.instance;
    }

    openModal(options: OpenOptions): Promise<void> {
        dispatchCustomEvent('vwk-open-wc-modal', options);
        return Promise.resolve();
    }

    closeModal(): void {
        dispatchCustomEvent('vwk-close-wc-modal', undefined);
    }

    /**
     * Subscribe to modal state change
     */
    subscribeModal(
        callback: (newState: SubscribeModalState) => void,
    ): () => void {
        this.eventEmitter.on(MODAL_STATE_EVENT, callback);

        return () => {
            this.eventEmitter.off(MODAL_STATE_EVENT, callback);
        };
    }

    updateModalState(state: SubscribeModalState): void {
        this.eventEmitter.emit(MODAL_STATE_EVENT, state);
    }
}

export { CustomWalletConnectModal };
