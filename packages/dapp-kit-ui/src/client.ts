/// <reference types="@vechain/connex" />
import type { DAppKitOptions, WalletManager } from '@vechain/dapp-kit';
import { DAppKit } from '@vechain/dapp-kit';
import { CustomWalletConnectModal, DAppKitModal } from './modal';
import {
    type CustomizedStyle,
    dispatchCustomEvent,
    configureUI,
} from './utils';
import { type I18n, type ThemeMode } from './constants';

let dappKit: DAppKit | null = null;
let dappKitOptions: DAppKitUIOptions | null = null;

export type DAppKitUIOptions = DAppKitOptions & {
    themeMode?: ThemeMode;
    themeVariables?: CustomizedStyle;
    i18n?: I18n;
    language?: string;
    modalParent?: HTMLElement;
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
        dappKitOptions = options;
        dappKit = new DAppKit(options);

        // init modal so on the first opening it doesn't have to create it
        DAppKitModal.getInstance(this.wallet, {
            modalParent: options.modalParent,
        });

        // configure bottons and modals options
        configureUI(options);

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
        return DAppKitModal.getInstance(this.wallet, {
            modalParent: dappKitOptions?.modalParent,
        });
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
