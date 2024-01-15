/// <reference types="@vechain/connex" />
import type { DAppKitOptions, WalletManager } from '@vechain/dapp-kit';
import { DAppKit } from '@vechain/dapp-kit';
import { CustomWalletConnectModal, ConnectModalManager } from './classes';
import {
    type CustomizedStyle,
    dispatchCustomEvent,
    configureUI,
} from './utils';
import type { SourceInfo, I18n, ThemeMode } from './constants';

let dappKit: DAppKit | null = null;
let dappKitOptions: DAppKitUIOptions | null = null;
let initialized = false;

export type DAppKitUIOptions = DAppKitOptions & {
    themeMode?: ThemeMode;
    themeVariables?: CustomizedStyle;
    i18n?: I18n;
    language?: string;
    modalParent?: HTMLElement;
    onSourceClick?: (source?: SourceInfo) => void;
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

        // init modal so that on the first opening it doesn't have to create it
        ConnectModalManager.getInstance(this.wallet, {
            modalParent: options.modalParent,
        });

        // configure bottons and modals options
        configureUI(options);
        dispatchCustomEvent('vdk-dapp-kit-configured');

        initialized = true;

        return dappKit;
    },

    get initialized(): boolean {
        return initialized;
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

    get modal(): ConnectModalManager {
        return ConnectModalManager.getInstance(this.wallet, {
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
