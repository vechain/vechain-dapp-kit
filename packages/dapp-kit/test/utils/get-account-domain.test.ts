import { ABIContract } from '@vechain/sdk-core';
import { describe, expect, it, vi } from 'vitest';
import { VNS_RESOLVER } from '../../src';
import {
    getAccountDomain,
    getAccountDomains,
} from '../../src/utils/get-account-domain';

describe('getAccountDomain', () => {
    const mockThor = {
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
        const result = await getAccountDomain({
            address: null,
            thor: mockThor.thor,
        });
        expect(result).toBeNull();
    });

    it('should return the domain name for a valid address', async () => {
        const mockAddress = '0x1234567890123456789012345678901234567890';
        const mockDomain = 'test.vet';

        mockThor.thor.contracts.executeCall.mockResolvedValue({
            result: {
                array: [[mockDomain]],
            },
        });

        const result = await getAccountDomain({
            address: mockAddress,
            thor: mockThor.thor,
        });

        expect(result).toBe(mockDomain);
        expect(mockThor.thor.contracts.executeCall).toHaveBeenCalledWith(
            VNS_RESOLVER.main,
            ABIContract.ofAbi(VNS_RESOLVER.abi).getFunction('getNames'),
            [[mockAddress]],
        );
    });

    it('should return domains for multiple addresses', async () => {
        const mockAddressA = '0x1234567890123456789012345678901234567890';
        const mockAddressB = '0x223456789012345678901234567890123456789A';

        mockThor.thor.contracts.executeCall.mockResolvedValue({
            result: {
                array: [['alice.vet', '']],
            },
        });

        const result = await getAccountDomains({
            addresses: [mockAddressA, mockAddressB],
            thor: mockThor.thor,
        });

        expect(result).toEqual({
            [mockAddressA]: 'alice.vet',
            [mockAddressB]: null,
        });
        expect(mockThor.thor.contracts.executeCall).toHaveBeenCalledWith(
            VNS_RESOLVER.main,
            ABIContract.ofAbi(VNS_RESOLVER.abi).getFunction('getNames'),
            [[mockAddressA, mockAddressB.toLowerCase()]],
        );
    });

    it('should return null if no domain is found', async () => {
        const mockAddress = '0x1234567890123456789012345678901234567890';

        mockThor.thor.contracts.executeCall.mockResolvedValue({
            result: {
                array: [],
            },
        });

        const result = await getAccountDomain({
            address: mockAddress,
            thor: mockThor.thor,
        });

        expect(result).toBeNull();
    });

    it('should use test network resolver if genesis ID matches', async () => {
        await getAccountDomain({
            address: '0x1234567890123456789012345678901234567890',
            thor: mockThor.thor,
        });

        expect(mockThor.thor.contracts.executeCall).toHaveBeenCalledWith(
            VNS_RESOLVER.main,
            ABIContract.ofAbi(VNS_RESOLVER.abi).getFunction('getNames'),
            [['0x1234567890123456789012345678901234567890']],
        );
    });
});
