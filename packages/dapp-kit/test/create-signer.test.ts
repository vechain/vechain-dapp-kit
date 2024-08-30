import { describe, it, expect, vi } from 'vitest';
import { VeChainProvider } from '@vechain/sdk-network';
import { VeChainSignerDappKit } from '../src/classes/vechain-signer';
import { createSDKSigner } from '../src/utils/create-signer';

// Mocking window.vechain

describe('createSDKSigner', () => {
    const mockAddress = '0x123';
    const mockGenesis = 'test';
    const genesisId =
        '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127';

    beforeEach(() => {
        global.window.vechain = {
            newConnexSigner: vi.fn().mockReturnValue({
                sign: vi.fn(),
            }),
        };
    });

    it('should return a VeChainSignerDappKit instance for veWorld source', () => {
        const result = createSDKSigner('veworld', mockGenesis, mockAddress);

        console.log(result);
        expect(window?.vechain?.newConnexSigner).toHaveBeenCalledWith(
            genesisId,
        );
        expect(result).toBeInstanceOf(VeChainSignerDappKit);
        expect(result?.address).toBe(mockAddress);
        expect(result?.provider).toBeInstanceOf(VeChainProvider);
    });

    it('should throw an error if VeWorld Extension is not installed', () => {
        global.window.vechain = undefined as any; // Simulate extension not installed

        expect(() =>
            createSDKSigner('veworld', mockGenesis, mockAddress),
        ).toThrow('VeWorld Extension is not installed');
    });

    it('should return undefined for unsupported wallet sources', () => {
        const result = createSDKSigner(
            'unsupported' as any,
            mockGenesis,
            mockAddress,
        );

        expect(result).toBeUndefined();
    });
});
