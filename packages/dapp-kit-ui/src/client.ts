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
import { proxy } from 'valtio';

let dappKit: DAppKit | null = null;
let initialized = false;

export type DAppKitUIOptions = DAppKitOptions & {
    themeMode?: ThemeMode;
    themeVariables?: CustomizedStyle;
    i18n?: I18n;
    language?: string;
    modalParent?: HTMLElement;
    onSourceClick?: (source?: SourceInfo) => void;
};

const dappKitOptions = proxy<Partial<DAppKitUIOptions>>({});

export const DAppKitUI = {
    options: dappKitOptions,
    configure(options: DAppKitUIOptions): DAppKit {
        if (
            options.walletConnectOptions &&
            !options.walletConnectOptions.modal
        ) {
            options.walletConnectOptions.modal =
                CustomWalletConnectModal.getInstance();
        }

        for (const key in options) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
            (dappKitOptions as any)[key] = (options as any)[key];
        }

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
            modalParent: dappKitOptions.modalParent,
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
