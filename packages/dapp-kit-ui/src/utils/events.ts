import type { OpenOptions } from '@vechain/dapp-kit';
import { DAppKitLogger } from '@vechain/dapp-kit';
import type { ThemeMode } from '../constants';

export type EventTypes =
    | 'vdk-dapp-kit-configured'
    | 'vdk-request-connection-certificate'
    | 'vdk-close-connection-certificate-request'
    | 'vdk-open-wc-qrcode'
    | 'vdk-close-wc-qrcode'
    | 'vdk-open-wallet-modal'
    | 'vdk-close-wallet-modal';

type ThemeOptions =
    | undefined
    | {
          theme?: ThemeMode;
      };

export interface EventArgs {
    'vdk-dapp-kit-configured': undefined;
    'vdk-request-connection-certificate': undefined;
    'vdk-close-connection-certificate-request': undefined;
    'vdk-close-wc-qrcode': undefined;
    'vdk-open-wc-qrcode': OpenOptions & ThemeOptions;
    'vdk-open-wallet-modal': ThemeOptions;
    'vdk-close-wallet-modal': undefined;
}

export const dispatchCustomEvent = <T extends EventTypes>(
    type: T,
    detail?: EventArgs[T],
): void => {
    DAppKitLogger.debug('dispatchCustomEvent', type, detail);
    const customEvent = new CustomEvent(type, {
        detail,
    });

    dispatchEvent(customEvent);
};

export const subscribeToCustomEvent = <T extends EventTypes>(
    type: T,
    callback?: (detail: EventArgs[T]) => void,
): (() => void) => {
    DAppKitLogger.debug('subscribeToCustomEvent', type);
    const handler = (ev: Event): void => {
        const _ev = ev as CustomEvent<EventArgs[T]>;

        callback?.(_ev.detail);
    };

    addEventListener(type, handler);

    return () => {
        removeEventListener(type, handler);
    };
};
