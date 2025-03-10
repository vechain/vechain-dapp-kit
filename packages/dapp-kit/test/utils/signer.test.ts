import { describe, expect, it, vi } from 'vitest';
import { SignClient } from '@walletconnect/sign-client';
import type { SignClientTypes } from '@walletconnect/types';
import type { WCModal, WCSigner } from '../../src';
import { createWcClient, createWcSigner } from '../../src';
import { mockedSignClient } from '../helpers/mocked-sign-client';
import { address } from '../helpers/mocked-signer';

vi.spyOn(SignClient, 'init').mockResolvedValue(mockedSignClient);

const projectId = 'abc1234';
const metadata: SignClientTypes.Options['metadata'] = {
    name: 'test',
    description: 'test',
    icons: ['test'],
    url: 'test',
};

const customModal: WCModal = {
    openModal: vi.fn(),
    closeModal: vi.fn(),
    subscribeModal: () => {
        return vi.fn();
    },
};

const createNewSignClient = (): WCSigner =>
    createWcSigner({
        genesisId: Promise.resolve('main'),
        wcClient: createWcClient({ projectId, metadata }),
        onDisconnected: () => {
            // eslint-disable-next-line no-console
            console.log('disconnected');
        },
        web3Modal: customModal,
    });

describe('createWcSigner', () => {
    it('can connect', async () => {
        const signer = createNewSignClient();

        const res = await signer.connect();

        expect(res.account.toLowerCase()).toBe(
            address.toString().toLowerCase(),
        );
    });

    it('can connect before signing TX', async () => {
        const signer = createNewSignClient();

        const txRes = await signer.signTx([], {});

        expect(txRes).toBeDefined();
    });

    it('can sign a cert', async () => {
        const signer = createNewSignClient();

        const certRes = await signer.signCert(
            {
                payload: { type: 'text', content: 'Hello World' },
                purpose: 'identification',
            },
            {},
        );

        expect(certRes).toBeDefined();
    });

    it('can disconnect', async () => {
        const signer = createNewSignClient();

        await signer.connect();

        await signer.disconnect();
    });
});
