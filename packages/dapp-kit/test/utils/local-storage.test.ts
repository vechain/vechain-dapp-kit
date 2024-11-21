import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Storage } from '../../src/utils/local-storage';

describe('Storage', () => {
    const mockLocalStorage = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
    };

    beforeEach(() => {
        global.localStorage = mockLocalStorage as any;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('setSource', () => {
        it('should set the wallet source', () => {
            Storage.setSource('WALLET_CONNECT' as any);
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                'dappkit@vechain/source',
                'WALLET_CONNECT',
            );
        });

        it('should remove the wallet source when null', () => {
            Storage.setSource(null);
            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
                'dappkit@vechain/source',
            );
        });
    });

    describe('setAccount', () => {
        it('should set the account', () => {
            Storage.setAccount('test-account');
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                'dappkit@vechain/account',
                'test-account',
            );
        });

        it('should remove the account when null', () => {
            Storage.setAccount(null);
            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
                'dappkit@vechain/account',
            );
        });
    });

    describe('setAccountDomain', () => {
        it('should set the account domain', () => {
            Storage.setAccountDomain('test-domain');
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                'dappkit@vechain/accountDomain',
                'test-domain',
            );
        });

        it('should remove the account domain when null', () => {
            Storage.setAccountDomain(null);
            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
                'dappkit@vechain/accountDomain',
            );
        });
    });

    describe('setConnectionCertificate', () => {
        const testCertificate = { some: 'data' } as any;

        it('should set the connection certificate', () => {
            Storage.setConnectionCertificate(testCertificate);
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                'dappkit@vechain/connectionCertificate',
                JSON.stringify(testCertificate),
            );
        });

        it('should remove the connection certificate when null', () => {
            Storage.setConnectionCertificate(null);
            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
                'dappkit@vechain/connectionCertificate',
            );
        });
    });

    describe('getSource', () => {
        it('should return the wallet source', () => {
            mockLocalStorage.getItem.mockReturnValue('WALLET_CONNECT');
            expect(Storage.getSource()).toBe('WALLET_CONNECT');
        });

        it('should return null when no wallet source is set', () => {
            mockLocalStorage.getItem.mockReturnValue(null);
            expect(Storage.getSource()).toBeNull();
        });
    });

    describe('getAccount', () => {
        it('should return the account', () => {
            mockLocalStorage.getItem.mockReturnValue('test-account');
            expect(Storage.getAccount()).toBe('test-account');
        });

        it('should return null when no account is set', () => {
            mockLocalStorage.getItem.mockReturnValue(null);
            expect(Storage.getAccount()).toBeNull();
        });
    });

    describe('getAccountDomain', () => {
        it('should return the account domain', () => {
            mockLocalStorage.getItem.mockReturnValue('test-domain');
            expect(Storage.getAccountDomain()).toBe('test-domain');
        });

        it('should return null when no account domain is set', () => {
            mockLocalStorage.getItem.mockReturnValue(null);
            expect(Storage.getAccountDomain()).toBeNull();
        });
    });

    describe('getConnectionCertificate', () => {
        const testCertificate = { some: 'data' } as any;

        it('should return the connection certificate', () => {
            mockLocalStorage.getItem.mockReturnValue(
                JSON.stringify(testCertificate),
            );
            expect(Storage.getConnectionCertificate()).toEqual(testCertificate);
        });

        it('should return null when no connection certificate is set', () => {
            mockLocalStorage.getItem.mockReturnValue(null);
            expect(Storage.getConnectionCertificate()).toBeNull();
        });
    });
});