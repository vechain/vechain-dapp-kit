import type { OpenOptions } from '@vechainfoundation/wallet-kit';
import type { ThemeMode } from '../constants';

export type EventTypes =
    | 'vwk-open-wc-modal'
    | 'vwk-close-wc-modal'
    | 'vwk-open-wallet-modal'
    | 'vwk-close-wallet-modal';

type ThemeOptions =
    | undefined
    | {
          theme?: ThemeMode;
      };

export interface EventArgs {
    'vwk-close-wc-modal': undefined;
    'vwk-open-wc-modal': OpenOptions & ThemeOptions;
    'vwk-open-wallet-modal': ThemeOptions;
    'vwk-close-wallet-modal': undefined;
}

export const dispatchCustomEvent = <T extends EventTypes>(
    type: T,
    detail: EventArgs[T],
): void => {
    const customEvent = new CustomEvent(type, {
        detail,
    });

    dispatchEvent(customEvent);
};

export const subscribeToCustomEvent = <T extends EventTypes>(
    type: T,
    callback: (detail: EventArgs[T]) => void,
): (() => void) => {
    const handler = (ev: Event): void => {
        const _ev = ev as CustomEvent<EventArgs[T]>;

        callback(_ev.detail);
    };

    addEventListener(type, handler);

    return () => {
        removeEventListener(type, handler);
    };
};
