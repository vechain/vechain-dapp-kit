// eslint-disable-next-line unicorn/prefer-node-protocol
import { EventEmitter } from 'events';
import type {
    OpenOptions,
    SubscribeModalState,
    WalletManager,
    WalletSource,
    WCModal,
} from '@vechainfoundation/dapp-kit';
import { DAppKitLogger } from '@vechainfoundation/dapp-kit';
import { subscribeKey } from 'valtio/utils';
import { dispatchCustomEvent, isMobile, subscribeToCustomEvent } from './utils';

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
        DAppKitLogger.debug('CustomWalletConnectModal', 'opening the modal');

        if (isMobile()) {
            window.open(
                `veworld://app.veworld?uri=${encodeURIComponent(options.uri)}`,
                '_self',
            );
            // TODO: commented out for now, as it's not working as expected, maybe a modal item is better
            // const linkingTime = new Date().getTime();
            // const TIMEOUT = 5000;
            // setTimeout(() => {
            //     const now = new Date().getTime();
            //     // avoid redirecting to the store if coming back from the app
            //     if (now - linkingTime < TIMEOUT + 250) {
            //         if (isAndroid()) {
            //             window.open(ANDROID_STORE_URL, '_self');
            //         } else {
            //             window.open(IOS_STORE_URL, '_self');
            //         }
            //     }
            // }, TIMEOUT);
        }
        dispatchCustomEvent('vwk-open-wc-modal', options);
        return Promise.resolve();
    }

    closeModal(): void {
        DAppKitLogger.debug('CustomWalletConnectModal', 'closing the modal');
        dispatchCustomEvent('vwk-close-wc-modal', undefined);
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

        const existingElement =
            window.document.querySelector('vwk-connect-modal');

        if (!existingElement) {
            DAppKitLogger.debug(
                'DAppKitModal',
                'OPEN',
                'creating a new element',
            );

            const element = window.document.createElement('vwk-connect-modal');

            window.document.body.appendChild(element);
        }

        dispatchCustomEvent('vwk-open-wallet-modal', undefined);
    }

    close(): void {
        DAppKitLogger.debug('DAppKitModal', 'closing the modal');
        dispatchCustomEvent('vwk-close-wallet-modal', undefined);
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
