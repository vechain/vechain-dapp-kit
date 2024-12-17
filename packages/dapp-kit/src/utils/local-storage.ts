import { HexUInt, Txt, type CertificateData } from '@vechain/sdk-core';
import type { WalletSource } from '../types';
import { DAppKitLogger } from './logger';

const STORAGE_PREFIX = 'dappkit@vechain';
const WALLET_SOURCE_KEY = `${STORAGE_PREFIX}/source`;
const ACCOUNT_KEY = `${STORAGE_PREFIX}/account`;
const CERTIFICATE_KEY = `${STORAGE_PREFIX}/connectionCertificate`;
const ACCOUNT_DOMAIN_KEY = `${STORAGE_PREFIX}/accountDomain`;

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

const setAccountDomain = (domain: string | null): void => {
    DAppKitLogger.debug('LocalStorage', 'setAccountDomain', domain);
    if (!domain) {
        localStorage.removeItem(ACCOUNT_DOMAIN_KEY);
    } else {
        localStorage.setItem(ACCOUNT_DOMAIN_KEY, domain);
    }
};

const setConnectionCertificate = (
    certificate: CertificateData | null,
): void => {
    DAppKitLogger.debug(
        'LocalStorage',
        'setConnectionCertificate',
        certificate,
    );
    if (!certificate) {
        localStorage.removeItem(CERTIFICATE_KEY);
    } else {
        const bytecode = HexUInt.of(Txt.of(JSON.stringify(certificate)).bytes);
        localStorage.setItem(CERTIFICATE_KEY, bytecode.toString());
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

const getAccountDomain = (): string | null => {
    const accountDomain = localStorage.getItem(ACCOUNT_DOMAIN_KEY);
    if (!accountDomain) {
        return null;
    }

    return accountDomain;
};

const getConnectionCertificate = (): CertificateData | null => {
    const connectionCertificate = localStorage.getItem(CERTIFICATE_KEY);

    if (!connectionCertificate) {
        return null;
    }

    const json = Txt.of(HexUInt.of(connectionCertificate).bytes);
    return JSON.parse(json.toString()) as CertificateData;
};

export const Storage = {
    setAccount,
    setSource,
    setConnectionCertificate,
    setAccountDomain,
    getAccountDomain,
    getAccount,
    getSource,
    getConnectionCertificate,
};
