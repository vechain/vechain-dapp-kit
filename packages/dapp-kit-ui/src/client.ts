/// <reference types="@vechain/connex" />
import type { DAppKitOptions, WalletManager } from '@vechain/dapp-kit';
import { DAppKit } from '@vechain/dapp-kit';
import { CustomWalletConnectModal, DAppKitModal } from './modal';
import { type CustomizedStyle, initStyles } from './styles';
import { dispatchCustomEvent } from './utils';

let dappKit: DAppKit | null = null;

export type DAppKitUIOptions = DAppKitOptions & {
    customStyles?: CustomizedStyle;
};

export const DAppKitUI = {
    configure(options: DAppKitUIOptions): DAppKit {
        if (
            options.walletConnectOptions &&
            !options.walletConnectOptions.modal
        ) {
            options.walletConnectOptions.modal =
                CustomWalletConnectModal.getInstance();
        }

        if (options.customStyles) {
            initStyles(options.customStyles);
        }

        dappKit = new DAppKit(options);

        // init modal to avoid waiting for the first opening
        DAppKitModal.getInstance(this.wallet);

        dispatchCustomEvent('vwk-dapp-kit-configured');

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
