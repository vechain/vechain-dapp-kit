import { describe, it, expect, vi, Mock } from 'vitest';
import { ThorClient, VeChainProvider } from '@vechain/sdk-network';
import { VechainWallet } from '../src';
import { VeChainSignerDAppKit } from '../src/classes/vechain-signer';
import { createSDKSigner } from '../src/utils/create-signer';

// Mock the necessary classes and methods
vi.mock('@vechain/sdk-network', () => ({
    ThorClient: {
        fromUrl: vi.fn().mockReturnValue({
            /* mock ThorClient instance */
        }),
    },
    VeChainProvider: vi.fn(),
    VeChainAbstractSigner: vi.fn(),
}));

vi.mock('../src/classes/vechain-signer', () => ({
    VeChainSignerDAppKit: vi.fn(),
}));

describe('createSDKSigner', () => {
    const mockWallet = {} as VechainWallet;
    const mockProvider = {} as VeChainProvider;
    const address = '0x456';

    it('should create a new VeChainSignerDAppKit with the correct parameters', () => {
        const mockThorClientInstance = ThorClient.fromUrl(
            'https://testnet.vechain.org',
        );
        const mockVeChainProviderInstance = new VeChainProvider(
            mockThorClientInstance,
        );

        const mockSignerInstance = {} as VeChainSignerDAppKit;
        (VeChainSignerDAppKit as unknown as Mock).mockReturnValue(
            mockSignerInstance,
        );
        (VeChainProvider as unknown as Mock).mockReturnValue(
            mockVeChainProviderInstance,
        );

        const result = createSDKSigner(
            mockWallet,
            'https://testnet.vechain.org',
            address,
        );

        expect(ThorClient.fromUrl).toHaveBeenCalledWith(
            'https://testnet.vechain.org',
        );
        expect(VeChainProvider).toHaveBeenCalledWith(mockThorClientInstance);
        expect(VeChainSignerDAppKit).toHaveBeenCalledWith(
            mockWallet, // Directly match mockWallet, since it's empty
            address,
            mockVeChainProviderInstance,
        );
        expect(result).toBe(mockSignerInstance);
    });
});
