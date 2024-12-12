import { describe, expect, it, vi } from 'vitest';
import { SignClient } from '@walletconnect/sign-client';
import { createWcModal } from '../../src';
import { mockedSignClient } from '../helpers/mocked-sign-client';

vi.spyOn(SignClient, 'init').mockResolvedValue(mockedSignClient);

const projectId = 'abc1234';

describe('createWcModal', () => {
    it('should cache the modal', () => {
        const wcModal = createWcModal(projectId);

        const wcModal2 = createWcModal(projectId);

        expect(wcModal).toEqual(wcModal2);
    });
});
