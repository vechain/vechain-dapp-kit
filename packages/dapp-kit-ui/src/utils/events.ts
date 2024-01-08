import type { OpenOptions } from '@vechain/dapp-kit';
import { DAppKitLogger } from '@vechain/dapp-kit';
import type { ThemeMode } from '../constants';

export type EventTypes =
    | 'vdk-dapp-kit-configured'
    | 'vdk-open-wc-modal'
    | 'vdk-close-wc-modal'
    | 'vdk-open-wallet-modal'
    | 'vdk-close-wallet-modal';

type ThemeOptions =
    | undefined
    | {
          theme?: ThemeMode;
      };

export interface EventArgs {
    'vdk-dapp-kit-configured': undefined;
    'vdk-close-wc-modal': undefined;
    'vdk-open-wc-modal': OpenOptions & ThemeOptions;
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
