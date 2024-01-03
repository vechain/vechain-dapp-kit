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
import { subscribeKey } from 'valtio/utils';
import { dispatchCustomEvent, subscribeToCustomEvent } from './utils';

const MODAL_STATE_EVENT = 'vwk-modal-state-change';

const isModalExisting = (): boolean => {
    const connectModal = document.querySelector('vwk-connect-modal');
    const connectModalWithButton = document.querySelector(
        'vwk-connect-button-with-modal',
    );
    const vechainConnect = document.querySelector(
        'vwk-vechain-dapp-connect-kit',
    );

    return (
        Boolean(connectModal) ||
        Boolean(connectModalWithButton) ||
        Boolean(vechainConnect)
    );
};

const findOrCreateModal = (options?: {
    modalParent?: HTMLElement;
}): HTMLElement => {
    const existing = document.querySelector('vwk-connect-modal');

    if (existing) {
        return existing;
    }
    DAppKitLogger.debug('DAppKitModal', 'creating a new modal');

    const element = document.createElement('vwk-connect-modal');

    (options?.modalParent || document.body).appendChild(element);

    return element;
};

class CustomWalletConnectModal implements WCModal {
    private static instance: CustomWalletConnectModal | null = null;

    private eventEmitter = new EventEmitter();

    private constructor() {
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

    /**
     * WalletConnect
     */
    openModal(options: OpenOptions): Promise<void> {
        DAppKitLogger.debug('CustomWalletConnectModal', 'opening the modal');

        if (isModalExisting()) {
            dispatchCustomEvent('vwk-open-wc-modal', options);
        } else {
            DAppKitLogger.debug('DAppKitModal', 'creating a new WC modal');

            findOrCreateModal();

            setTimeout(() => {
                dispatchCustomEvent('vwk-open-wc-modal', options);
            }, 100);
        }

        return Promise.resolve();
    }

    closeModal(): void {
        DAppKitLogger.debug('CustomWalletConnectModal', 'closing the modal');
        dispatchCustomEvent('vwk-close-wc-modal');
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

export class DAppKitModal {
    private static instance: DAppKitModal | null = null;

    private constructor(private walletManager: WalletManager) {}

    public static getInstance(walletManager: WalletManager): DAppKitModal {
        if (!DAppKitModal.instance) {
            DAppKitModal.instance = new DAppKitModal(walletManager);
        }

        return DAppKitModal.instance;
    }

    open(): void {
        DAppKitLogger.debug('DAppKitModal', 'opening the modal');

        if (isModalExisting()) {
            dispatchCustomEvent('vwk-open-wallet-modal');
        } else {
            findOrCreateModal();

            setTimeout(() => {
                dispatchCustomEvent('vwk-open-wallet-modal');
            }, 100);
        }
    }

    close(): void {
        DAppKitLogger.debug('DAppKitModal', 'closing the modal');
        dispatchCustomEvent('vwk-close-wallet-modal');
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
