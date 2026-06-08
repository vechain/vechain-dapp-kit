import { describe, expect, it, vi } from 'vitest';
import { createVeWorldV2Wallet } from '../../src/utils/create-veworld-v2-wallet';
import { typedDataMessage } from '../helpers/request-data';

const genesisId = '0xabc';

describe('createVeWorldV2Wallet', () => {
    it('omits typed data opts when no signer is provided', async () => {
        const request = vi.fn().mockResolvedValue('0xsignature');
        const { walletSigner } = createVeWorldV2Wallet(request, genesisId);

        await walletSigner.signTypedData!(
            typedDataMessage.domain,
            typedDataMessage.types,
            typedDataMessage.value,
            {},
        );

        expect(request).toHaveBeenCalledWith({
            method: 'thor_signTypedData',
            params: {
                domain: typedDataMessage.domain,
                types: typedDataMessage.types,
                value: typedDataMessage.value,
                genesisId,
            },
        });
    });

    it('keeps typed data opts when signer is provided', async () => {
        const request = vi.fn().mockResolvedValue('0xsignature');
        const { walletSigner } = createVeWorldV2Wallet(request, genesisId);
        const options = {
            signer: '0x0000000000000000000000000000000000000001',
        };

        await walletSigner.signTypedData!(
            typedDataMessage.domain,
            typedDataMessage.types,
            typedDataMessage.value,
            options,
        );

        expect(request).toHaveBeenCalledWith({
            method: 'thor_signTypedData',
            params: {
                domain: typedDataMessage.domain,
                types: typedDataMessage.types,
                value: typedDataMessage.value,
                opts: options,
                genesisId,
            },
        });
    });
});
