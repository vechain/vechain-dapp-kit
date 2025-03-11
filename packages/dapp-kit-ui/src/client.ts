import type { DAppKitOptions, WalletManager } from '@vechain/dapp-kit';
import { DAppKit } from '@vechain/dapp-kit';
import type { ThorClient } from '@vechain/sdk-network';
import { ConnectModalManager, CustomWalletConnectModal } from './classes';
import {
    type CustomizedStyle,
    dispatchCustomEvent,
    initModalAndButton,
} from './utils';
import type { I18n, SourceInfo, ThemeMode } from './constants';

export type { WalletConnectOptions, DAppKitOptions } from '@vechain/dapp-kit';

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

        // configure buttons and modals options
        initModalAndButton(options);
        dispatchCustomEvent('vdk-dapp-kit-configured');

        initialized = true;

        return dappKit;
    },

    get initialized(): boolean {
        return initialized;
    },

    get thor(): ThorClient {
        return this.get().thor;
    },

    get wallet(): WalletManager {
        return this.get().wallet;
    },

    get signer() {
        return this.get().signer;
    },

    get configuration(): DAppKitUIOptions | null {
        return dappKitOptions;
    },

    get modal(): ConnectModalManager {
        return ConnectModalManager.getInstance(this.wallet, {
            modalParent: dappKitOptions?.modalParent,
        });
    },

    get(): DAppKit {
        if (!dappKit) {
            console.error('🚨🚨🚨 DAppKitUI not configured 🚨🚨🚨');
            throw new Error('DAppKitUI not configured');
        }

        return dappKit;
    },
};
