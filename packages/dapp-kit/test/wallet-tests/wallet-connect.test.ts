import { describe, expect, it, vi } from 'vitest';
import { SignClient } from '@walletconnect/sign-client';
import type { WalletConnectOptions } from '../../src';
import { mockedSignClient } from '../helpers/mocked-sign-client';
import { createUnitTestConnex } from '../helpers/connex-helper';

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
            const thor = createUnitTestConnex();

            const sources = thor.wallet.state.availableSources;

            expect(sources).not.toContain('wallet-connect');
        });
    });

    describe('options provided', () => {
        it('get available sources - should include WC', () => {
            const thor = createUnitTestConnex(wcOptions);

            const sources = thor.wallet.state.availableSources;

            expect(sources).toContain('wallet-connect');
        });
    });
});
