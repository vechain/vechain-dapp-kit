import { HexUInt, Txt, type CertificateData } from '@vechain/sdk-core';
import type { WalletSource } from '../types';
import { DAppKitLogger } from './logger';

const STORAGE_PREFIX = 'dappkit@vechain';
const keysV1 = {
    WALLET_SOURCE: `${STORAGE_PREFIX}/source`,
    ACCOUNT: `${STORAGE_PREFIX}/account`,
    CERTIFICATE: `${STORAGE_PREFIX}/connectionCertificate`,
    ACCOUNT_DOMAIN: `${STORAGE_PREFIX}/accountDomain`,
} as const;

const STORAGE_V2_PREFIX = 'dappkit@vechain/v2';

const keysV2 = {
    WALLET_SOURCE: `${STORAGE_V2_PREFIX}/source`,
    ACCOUNT: `${STORAGE_V2_PREFIX}/account`,
    CERTIFICATE: `${STORAGE_V2_PREFIX}/connectionCertificate`,
    ACCOUNT_DOMAIN: `${STORAGE_V2_PREFIX}/accountDomain`,
} as const;

const setSource = (source: WalletSource | null): void => {
    DAppKitLogger.debug('LocalStorage', 'setSource', source);

    if (!source) {
        localStorage.removeItem(keysV2.WALLET_SOURCE);
    } else {
        localStorage.setItem(keysV2.WALLET_SOURCE, source);
    }
};

const setAccount = (account: string | null): void => {
    DAppKitLogger.debug('LocalStorage', 'setAccount', account);
    if (!account) {
        localStorage.removeItem(keysV2.ACCOUNT);
    } else {
        localStorage.setItem(keysV2.ACCOUNT, account);
    }
};

const setAccountDomain = (domain: string | null): void => {
    DAppKitLogger.debug('LocalStorage', 'setAccountDomain', domain);
    if (!domain) {
        localStorage.removeItem(keysV2.ACCOUNT_DOMAIN);
    } else {
        localStorage.setItem(keysV2.ACCOUNT_DOMAIN, domain);
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
        localStorage.removeItem(keysV2.CERTIFICATE);
    } else {
        const bytecode = HexUInt.of(Txt.of(JSON.stringify(certificate)).bytes);
        localStorage.setItem(keysV2.CERTIFICATE, bytecode.toString());
    }
};

const getSource = (): WalletSource | null => {
    const source = localStorage.getItem(keysV2.WALLET_SOURCE);

    if (!source) {
        return null;
    }

    return source as WalletSource;
};

const getAccount = (): string | null => {
    const account = localStorage.getItem(keysV2.ACCOUNT);

    if (!account) {
        return null;
    }

    return account;
};

const getAccountDomain = (): string | null => {
    const accountDomain = localStorage.getItem(keysV2.ACCOUNT_DOMAIN);
    if (!accountDomain) {
        return null;
    }

    return accountDomain;
};

const getConnectionCertificate = (): CertificateData | null => {
    const connectionCertificate = localStorage.getItem(keysV2.CERTIFICATE);

    if (!connectionCertificate) {
        return null;
    }

    const json = Txt.of(HexUInt.of(connectionCertificate).bytes);
    return JSON.parse(json.toString()) as CertificateData;
};

const wipeV1 = () => {
    localStorage.removeItem(keysV1.WALLET_SOURCE);
    localStorage.removeItem(keysV1.ACCOUNT);
    localStorage.removeItem(keysV1.CERTIFICATE);
    localStorage.removeItem(keysV1.ACCOUNT_DOMAIN);
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
    wipeV1,
};
