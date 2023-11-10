import type { OpenOptions } from '@vechainfoundation/wallet-kit';

export type EventTypes = 'vwk-open-wc-modal' | 'vwk-close-wc-modal';

export interface EventArgs {
    'vwk-close-wc-modal': undefined;
    'vwk-open-wc-modal': OpenOptions;
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
