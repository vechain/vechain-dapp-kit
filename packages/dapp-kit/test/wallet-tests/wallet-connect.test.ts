import { describe, expect, it, vi } from 'vitest';
import { SignClient } from '@walletconnect/sign-client';
import { createUnitTestDAppKit } from '../helpers/connex-helper';
import type { WalletConnectOptions } from '../../src';
import { mockedSignClient } from '../helpers/mocked-sign-client';
import { certMessage } from '../helpers/request-data';

const wcOptions: WalletConnectOptions = {
    projectId: 'test1234',
    metadata: {
        name: 'Test',
        description: 'Test wallet',
        url: 'https://test.com',
        icons: ['https://test.com/icon.png'],
    },
};

vi.spyOn(SignClient, 'init').mockResolvedValue(mockedSignClient);

describe('wallet-connect', () => {
    describe('no options provided', () => {
        it('get available sources - should not include WC', () => {
            const dk = createUnitTestDAppKit();

            const sources = dk.wallet.state.availableSources;

            expect(sources).not.toContain('wallet-connect');
        });
    });

    describe('options provided', () => {
        it('get available sources - should include WC', () => {
            const dk = createUnitTestDAppKit(wcOptions);

            const sources = dk.wallet.state.availableSources;

            expect(sources).toContain('wallet-connect');
        });

        it('can connect', async () => {
            const dk = createUnitTestDAppKit(wcOptions);

            dk.wallet.setSource('wallet-connect');

            const acc = await dk.wallet.connect();

            expect(acc).toBeDefined();
        });

        it('it can sign a cert', async () => {
            const dk = createUnitTestDAppKit(wcOptions);

            dk.wallet.setSource('wallet-connect');

            const certRes = await dk.wallet.signCert(certMessage);

            expect(certRes).toBeDefined();
        });

        it('can sign a tx', async () => {
            const dk = createUnitTestDAppKit(wcOptions);

            dk.wallet.setSource('wallet-connect');

            const txRes = await dk.wallet.requestTransaction([]);

            expect(txRes).toBeDefined();
        });
    });
});
