import { describe, it, expect, vi } from 'vitest';
import { getAddress } from './getAddress';
import { genesisBlocks } from '@vechain/dapp-kit';
import { VNS_RESOLVER } from '../constants';

describe('getAddress', () => {
    const mockConnex = {
        thor: {
            genesis: {
                id: genesisBlocks.main.id,
            },
            account: vi.fn().mockReturnThis(),
            method: vi.fn().mockReturnThis(),
            call: vi.fn(),
        },
    } as any;

    it('should return null if domain is null', async () => {
        const result = await getAddress({ domain: null, connex: mockConnex });
        expect(result).toBeNull();
    });

    it('should use main resolver for mainnet', async () => {
        mockConnex.thor.call.mockResolvedValue({
            decoded: {
                addresses: ['0x1234567890123456789012345678901234567890'],
            },
        });

        await getAddress({ domain: 'example.vet', connex: mockConnex });

        expect(mockConnex.thor.account).toHaveBeenCalledWith(VNS_RESOLVER.main);
    });

    it('should use test resolver for testnet', async () => {
        const testConnex = {
            ...mockConnex,
            thor: {
                ...mockConnex.thor,
                genesis: { id: genesisBlocks.test.id },
            },
        };

        await getAddress({ domain: 'example.vet', connex: testConnex });

        expect(testConnex.thor.account).toHaveBeenCalledWith(VNS_RESOLVER.test);
    });

    it('should return the first address from the resolved addresses', async () => {
        const expectedAddress = '0x1234567890123456789012345678901234567890';
        mockConnex.thor.call.mockResolvedValue({
            decoded: { addresses: [expectedAddress] },
        });

        const result = await getAddress({
            domain: 'example.vet',
            connex: mockConnex,
        });

        expect(result).toBe(expectedAddress);
    });

    it('should return null if no addresses are resolved', async () => {
        mockConnex.thor.call.mockResolvedValue({
            decoded: { addresses: [] },
        });

        const result = await getAddress({
            domain: 'example.vet',
            connex: mockConnex,
        });

        expect(result).toBeNull();
    });
});
