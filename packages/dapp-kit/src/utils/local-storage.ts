import * as ThorDevkit from 'thor-devkit';
import type { WalletSource } from '../types';
import { DAppKitLogger } from './logger';

const STORAGE_PREFIX = 'dappkit@vechain';
const WALLET_SOURCE_KEY = `${STORAGE_PREFIX}/source`;
const ACCOUNT_KEY = `${STORAGE_PREFIX}/account`;
const CERTIFICATE_KEY = `${STORAGE_PREFIX}/connectionCertificate`;

const setSource = (source: WalletSource | null): void => {
    DAppKitLogger.debug('LocalStorage', 'setSource', source);

    if (!source) {
        localStorage.removeItem(WALLET_SOURCE_KEY);
    } else {
        localStorage.setItem(WALLET_SOURCE_KEY, source);
    }
};

const setAccount = (account: string | null): void => {
    DAppKitLogger.debug('LocalStorage', 'setAccount', account);
    if (!account) {
        localStorage.removeItem(ACCOUNT_KEY);
    } else {
        localStorage.setItem(ACCOUNT_KEY, account);
    }
};

const setConnectionCertificate = (
    certificate: ThorDevkit.Certificate | null,
): void => {
    DAppKitLogger.debug(
        'LocalStorage',
        'setConnectionCertificate',
        certificate,
    );
    if (!certificate) {
        localStorage.removeItem(CERTIFICATE_KEY);
    } else {
        localStorage.setItem(CERTIFICATE_KEY, JSON.stringify(certificate));
    }
};

const getSource = (): WalletSource | null => {
    const source = localStorage.getItem(WALLET_SOURCE_KEY);

    if (!source) {
        return null;
    }

    return source as WalletSource;
};

const getAccount = (): string | null => {
    const account = localStorage.getItem(ACCOUNT_KEY);

    if (!account) {
        return null;
    }

    return account;
};

const getConnectionCertificate = (): ThorDevkit.Certificate | null => {
    const connectionCertificate = localStorage.getItem(CERTIFICATE_KEY);

    if (!connectionCertificate) {
        return null;
    }

    return JSON.parse(connectionCertificate) as ThorDevkit.Certificate;
};

export const Storage = {
    setAccount,
    setSource,
    setConnectionCertificate,
    getAccount,
    getSource,
    getConnectionCertificate,
};
