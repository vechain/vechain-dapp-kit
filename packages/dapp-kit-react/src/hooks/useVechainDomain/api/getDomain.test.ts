import { describe, it, expect, vi } from 'vitest';
import { getDomain } from './getDomain';
import { genesisBlocks } from '@vechain/dapp-kit';
import { VNS_RESOLVER } from '../constants';

describe('getDomain', () => {
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

    it('should return null if address is null', async () => {
        const result = await getDomain({ address: null, connex: mockConnex });
        expect(result).toBeUndefined();
    });

    it('should use main resolver for mainnet', async () => {
        mockConnex.thor.call.mockResolvedValue({
            decoded: {
                names: ['example.vet'],
            },
        });

        await getDomain({
            address: '0x1234567890123456789012345678901234567890',
            connex: mockConnex,
        });

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

        await getDomain({
            address: '0x1234567890123456789012345678901234567890',
            connex: testConnex,
        });

        expect(testConnex.thor.account).toHaveBeenCalledWith(VNS_RESOLVER.test);
    });

    it('should return the first name from the resolved names', async () => {
        const expectedDomain = 'example.vet';
        mockConnex.thor.call.mockResolvedValue({
            decoded: { names: [expectedDomain] },
        });

        const result = await getDomain({
            address: '0x1234567890123456789012345678901234567890',
            connex: mockConnex,
        });

        expect(result).toBe(expectedDomain);
    });

    it('should return null if no names are resolved', async () => {
        mockConnex.thor.call.mockResolvedValue({
            decoded: { names: [] },
        });

        const result = await getDomain({
            address: '0x1234567890123456789012345678901234567890',
            connex: mockConnex,
        });

        expect(result).toBeUndefined();
    });
});
