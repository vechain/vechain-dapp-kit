/// <reference types="@vechain/connex" />
import type { DAppKitOptions, WalletManager } from '@vechain/dapp-kit';
import { DAppKit } from '@vechain/dapp-kit';
import { CustomWalletConnectModal, DAppKitModal } from './modal';

let dappKit: DAppKit | null = null;

export type DAppKitUIOptions = DAppKitOptions & {
    modalZIndex?: number;
};

const DAppKitUI = {
    configure(options: DAppKitUIOptions): DAppKit {
        if (
            options.walletConnectOptions &&
            !options.walletConnectOptions.modal
        ) {
            options.walletConnectOptions.modal =
                CustomWalletConnectModal.getInstance();
        }

        if (options.modalZIndex) {
            const root: HTMLElement | null = document.querySelector(':root');

            if (root) {
                root.style.setProperty(
                    '--vwk-modal-z-index',
                    options.modalZIndex.toString(),
                );
            }
        }

        dappKit = new DAppKit(options);

        return dappKit;
    },

    get thor(): Connex.Thor {
        return this.get().thor;
    },

    get vendor(): Connex.Vendor {
        return this.get().vendor;
    },

    get wallet(): WalletManager {
        return this.get().wallet;
    },

    get modal(): DAppKitModal {
        return DAppKitModal.getInstance(this.wallet);
    },

    get(): DAppKit {
        if (!dappKit) {
            // eslint-disable-next-line no-console
            console.error('🚨🚨🚨 DAppKitUI not configured 🚨🚨🚨');
            throw new Error('DAppKitUI not configured');
        }

        return dappKit;
    },
};

export { DAppKitUI };
