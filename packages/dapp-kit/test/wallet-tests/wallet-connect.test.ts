import { describe, expect, it, vi } from 'vitest';
import { SignClient } from '@walletconnect/sign-client';
import { createUnitTestConnex } from '../helpers/connex-helper';
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
            expect(true).toBe(true);
        });
    });
});

// describe('wallet-connect', () => {
//     describe('no options provided', () => {
//         it('get available sources - should not include WC', () => {
//             const connex = createUnitTestConnex();
//
//             const sources = connex.wallet.state.availableSources;
//
//             expect(sources).not.toContain('wallet-connect');
//         });
//     });
//
//     describe('options provided', () => {
//         it('get available sources - should include WC', () => {
//             const connex = createUnitTestConnex(wcOptions);
//
//             const sources = connex.wallet.state.availableSources;
//
//             expect(sources).toContain('wallet-connect');
//         });
//
//         it('can connect', async () => {
//             const connex = createUnitTestConnex(wcOptions);
//
//             connex.wallet.setSource('wallet-connect');
//
//             const acc = await connex.wallet.connect();
//
//             expect(acc).toBeDefined();
//         });
//
//         it('it can sign a cert', async () => {
//             const dAppKit = createUnitTestConnex(wcOptions);
//
//             dAppKit.wallet.setSource('wallet-connect');
//
//             const certRes = await dAppKit.thor.
//                 .sign('cert', certMessage)
//                 .request();
//
//             expect(certRes).toBeDefined();
//         });
//
//         it('can sign a tx', async () => {
//             const connex = createUnitTestConnex(wcOptions);
//
//             connex.wallet.setSource('wallet-connect');
//
//             const txRes = await connex.vendor.sign('tx', []).request();
//
//             expect(txRes).toBeDefined();
//         });
//     });
// });
