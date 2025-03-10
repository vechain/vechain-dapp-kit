import { describe, it, expect, vi } from 'vitest';
import { getDomain } from '../../../../src/hooks/useVechainDomain/api/getDomain';
import { genesisBlocks, VNS_RESOLVER } from '@vechain/dapp-kit';
import { ABIContract } from '@vechain/sdk-core';

describe('getDomain', () => {
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

    it('should return null if address is null', async () => {
        const result = await getDomain({ address: null, thor: mockThorClient });
        expect(result).toBeUndefined();
    });

    it('should use main resolver for mainnet', async () => {
        mockThorClient.thor.blocks.getGenesisBlock.mockResolvedValue({
            id: genesisBlocks.main.id,
        });
        mockThorClient.thor.contracts.executeCall.mockResolvedValue({
            result: {
                array: ['example.vet'],
            },
        });

        const result = await getDomain({
            address: '0x1234567890123456789012345678901234567890',
            thor: mockThorClient.thor,
        });

        expect(mockThorClient.thor.contracts.executeCall).toHaveBeenCalledWith(
            VNS_RESOLVER.main,
            ABIContract.ofAbi(VNS_RESOLVER.abi).getFunction('getNames'),
            ['0x1234567890123456789012345678901234567890'],
        );

        expect(result).toBe('example.vet');
    });

    it('should use test resolver for testnet', async () => {
        mockThorClient.thor.blocks.getGenesisBlock.mockResolvedValue({
            id: genesisBlocks.test.id,
        });
        mockThorClient.thor.contracts.executeCall.mockResolvedValue({
            result: {
                array: ['example.vet'],
            },
        });

        const result = await getDomain({
            address: '0x1234567890123456789012345678901234567890',
            thor: mockThorClient.thor,
        });

        expect(mockThorClient.thor.contracts.executeCall).toHaveBeenCalledWith(
            VNS_RESOLVER.test,
            ABIContract.ofAbi(VNS_RESOLVER.abi).getFunction('getNames'),
            ['0x1234567890123456789012345678901234567890'],
        );

        expect(result).toBe('example.vet');
    });

    it('should return the first name from the resolved names', async () => {
        const expectedDomain = 'example.vet';
        mockThorClient.thor.contracts.executeCall.mockResolvedValue({
            result: {
                array: [expectedDomain],
            },
        });

        const result = await getDomain({
            address: '0x1234567890123456789012345678901234567890',
            thor: mockThorClient.thor,
        });

        expect(result).toBe(expectedDomain);
    });

    it('should return null if no names are resolved', async () => {
        mockThorClient.thor.contracts.executeCall.mockResolvedValue({
            result: {
                array: [],
            },
        });

        const result = await getDomain({
            address: '0x1234567890123456789012345678901234567890',
            thor: mockThorClient.thor,
        });

        expect(result).toBeUndefined();
    });
});
