/* eslint-disable no-console */

const LogLevel = {
    NONE: 0,
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    DEBUG: 4,
};

let currentLogLevel = LogLevel.NONE;

export type LogLevel = keyof typeof LogLevel;

export const DAppKitLogger = {
    configure(level: LogLevel): void {
        currentLogLevel = LogLevel[level];
    },

    debug(domain: string, context: string, ...args: unknown[]): void {
        if (currentLogLevel >= LogLevel.DEBUG) {
            console.log(`[${domain}] (${context})`, ...args);
        }
    },

    info(domain: string, context: string, ...args: unknown[]): void {
        if (currentLogLevel >= LogLevel.INFO) {
            console.info(`[${domain}] (${context})`, ...args);
        }
    },

    warn(domain: string, context: string, ...args: unknown[]): void {
        if (currentLogLevel >= LogLevel.WARN) {
            console.warn(`[${domain}] (${context})`, ...args);
        }
    },

    error(domain: string, context: string, ...args: unknown[]): void {
        if (currentLogLevel >= LogLevel.ERROR) {
            console.error(`[${domain}] (${context})`, ...args);
        }
    },
};
