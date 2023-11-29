// eslint-disable-next-line unicorn/prefer-node-protocol
import { EventEmitter } from 'events';
import type {
    OpenOptions,
    SubscribeModalState,
    WCModal,
} from '@vechainfoundation/dapp-kit';
import {
    dispatchCustomEvent,
    isAndroid,
    isMobile,
    subscribeToCustomEvent,
} from './utils';
import { ANDROID_STORE_URL, IOS_STORE_URL } from './constants';

const MODAL_STATE_EVENT = 'vwk-modal-state-change';

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
        if (isMobile()) {
            const newWindow = window.open(
                `veworld://app.veworld?uri=${encodeURIComponent(options.uri)}`,
                '_self',
            );
            setTimeout(() => {
                if (newWindow) {
                    if (isAndroid()) {
                        window.open(ANDROID_STORE_URL, '_self');
                    } else {
                        window.open(IOS_STORE_URL, '_self');
                    }
                }
            }, 5000);
        }
        dispatchCustomEvent('vwk-open-wc-modal', options);
        return Promise.resolve();
    }

    closeModal(): void {
        dispatchCustomEvent('vwk-close-wc-modal', undefined);
    }

    subscribeModal(
        callback: (newState: SubscribeModalState) => void,
    ): () => void {
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

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    public static getInstance(): DAppKitModal {
        if (!DAppKitModal.instance) {
            DAppKitModal.instance = new DAppKitModal();
        }

        return DAppKitModal.instance;
    }

    open(): void {
        dispatchCustomEvent('vwk-open-wallet-modal', undefined);
    }

    close(): void {
        dispatchCustomEvent('vwk-close-wallet-modal', undefined);
    }
}

export { CustomWalletConnectModal };
