import type {
    CertificateMessage,
    ConnectV2Response,
    DAppKitOptions,
    TypedDataMessage,
    WalletManager,
} from '@vechain/dapp-kit';
import { DAppKit } from '@vechain/dapp-kit';
import type { ThorClient } from '@vechain/sdk-network';
import { ConnectModalManager, CustomWalletConnectModal } from './classes';
import type { I18n, SourceInfo, ThemeMode } from './constants';
import {
    type CustomizedStyle,
    dispatchCustomEvent,
    initModalAndButton,
} from './utils';

export type { DAppKitOptions, WalletConnectOptions } from '@vechain/dapp-kit';

type OnConnectV2Callbacks = {
    /**
     * Callback that is called before `connectV2` is called.
     * The value returned from this function will be passed to `connectV2`
     * @default () => Promise.resolve(null)
     * @param source Source that triggered the connection request
     * @returns A value that can be passed to `connectV2`
     */
    onConnectRequest?: (
        source: SourceInfo,
    ) => Promise<null | CertificateMessage | TypedDataMessage>;
    /**
     * Callback that is called after `connectV2` is called.
     * @default () => Promise.resolve()
     * @param source Source that triggered the connection request
     * @param response Response from the `connectV2` function
     */
    onConnectResponse?: (
        source: SourceInfo,
        response: ConnectV2Response<any>,
    ) => Promise<void>;
};

type ParsedOptions = Omit<DAppKitUIOptions, 'v2Api'> & {
    v2Api: DAppKitOptions['v2Api'] & Required<OnConnectV2Callbacks>;
};

let dappKit: DAppKit | null = null;
let dappKitOptions: ParsedOptions | null = null;
let initialized = false;

export type DAppKitUIOptions = DAppKitOptions & {
    themeMode?: ThemeMode;
    themeVariables?: CustomizedStyle;
    i18n?: I18n;
    language?: string;
    modalParent?: HTMLElement;
    onSourceClick?: (source?: SourceInfo) => void;
    v2Api: DAppKitOptions['v2Api'] & OnConnectV2Callbacks;
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
        if (!options.v2Api.onConnectRequest)
            options.v2Api.onConnectRequest = () => Promise.resolve(null);
        if (!options.v2Api.onConnectResponse)
            options.v2Api.onConnectResponse = () => Promise.resolve();
        dappKitOptions = options as ParsedOptions;
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

    get configuration(): ParsedOptions | null {
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
