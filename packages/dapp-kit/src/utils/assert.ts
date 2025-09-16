import { DAppKitLogger } from './logger';

export function assertDefined<T>(
    value: T,
    domain: string,
    context: string,
    ...message: unknown[]
): asserts value is NonNullable<T> {
    if (!value) {
        DAppKitLogger.error(domain, context, ...message);
        throw new Error(message.join('\n'));
    }
}

export function assertNotNull<T>(
    value: T,
    domain: string,
    context: string,
    ...message: unknown[]
): asserts value is Exclude<T, null> {
    if (value === null) {
        DAppKitLogger.error(domain, context, ...message);
        throw new Error(message.join('\n'));
    }
}
