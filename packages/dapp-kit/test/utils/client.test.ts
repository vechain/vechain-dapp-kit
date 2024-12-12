import { describe, expect, it, vi } from 'vitest';
import type { SignClientTypes } from '@walletconnect/types';
import { SignClient } from '@walletconnect/sign-client';
import { createWcClient } from '../../src';
import { mockedSignClient } from '../helpers/mocked-sign-client';

vi.spyOn(SignClient, 'init').mockResolvedValue(mockedSignClient);

const projectId = 'abc1234';
const metadata: SignClientTypes.Options['metadata'] = {
    name: 'test',
    description: 'test',
    icons: ['test'],
    url: 'test',
};

describe('createWcClient', () => {
    it('should cache the client', async () => {
        const wcClient = createWcClient({ projectId, metadata });

        const wcClient2 = createWcClient({ projectId, metadata });

        const resolved1 = await wcClient.get();
        const resolved2 = await wcClient2.get();

        expect(resolved1.name).toBeDefined();
        expect(resolved1.name).toBe(resolved2.name);
    });
});
