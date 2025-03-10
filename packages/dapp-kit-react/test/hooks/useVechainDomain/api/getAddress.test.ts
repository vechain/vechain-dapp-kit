import { describe, it, expect, vi } from 'vitest';
import { getAddress } from '../../../../src/hooks/useVechainDomain/api/getAddress';
import { genesisBlocks, VNS_RESOLVER } from '@vechain/dapp-kit';
import { ABIContract } from '@vechain/sdk-core';

describe('getAddress', () => {
    const mockThorClient = {
        thor: {
            blocks: {
                getGenesisBlock: vi.fn(),
            },
            contracts: {
                executeCall: vi.fn(),
            },
        },
    } as any;

    it('should return null if domain is null', async () => {
        const result = await getAddress({ domain: null, thor: mockThorClient });
        expect(result).toBeUndefined();
    });

    it('should use main resolver for mainnet', async () => {
        mockThorClient.thor.blocks.getGenesisBlock.mockResolvedValue({
            id: genesisBlocks.main.id,
        });
        mockThorClient.thor.contracts.executeCall.mockResolvedValue({
            result: {
                array: ['0x1234567890123456789012345678901234567890'],
            },
        });

        const result = await getAddress({
            domain: 'example.vet',
            thor: mockThorClient.thor,
        });

        expect(mockThorClient.thor.contracts.executeCall).toHaveBeenCalledWith(
            VNS_RESOLVER.main,
            ABIContract.ofAbi(VNS_RESOLVER.abi).getFunction('getAddresses'),
            ['example.vet'],
        );

        expect(result).toBe('0x1234567890123456789012345678901234567890');
    });

    it('should use test resolver for testnet', async () => {
        mockThorClient.thor.blocks.getGenesisBlock.mockResolvedValue({
            id: genesisBlocks.test.id,
        });
        mockThorClient.thor.contracts.executeCall.mockResolvedValue({
            result: {
                array: ['0x1234567890123456789012345678901234567890'],
            },
        });

        const result = await getAddress({
            domain: 'example.vet',
            thor: mockThorClient.thor,
        });

        expect(mockThorClient.thor.contracts.executeCall).toHaveBeenCalledWith(
            VNS_RESOLVER.test,
            ABIContract.ofAbi(VNS_RESOLVER.abi).getFunction('getAddresses'),
            ['example.vet'],
        );

        expect(result).toBe('0x1234567890123456789012345678901234567890');
    });

    it('should return the first address from the resolved addresses', async () => {
        const expectedAddress = '0x1234567890123456789012345678901234567890';
        mockThorClient.thor.contracts.executeCall.mockResolvedValue({
            result: {
                array: [expectedAddress],
            },
        });

        const result = await getAddress({
            domain: 'example.vet',
            thor: mockThorClient.thor,
        });

        expect(result).toBe(expectedAddress);
    });

    it('should return null if no addresses are resolved', async () => {
        mockThorClient.thor.contracts.executeCall.mockResolvedValue({
            result: {
                array: [],
            },
        });

        const result = await getAddress({
            domain: 'example.vet',
            thor: mockThorClient.thor,
        });

        expect(result).toBeUndefined();
    });
});
