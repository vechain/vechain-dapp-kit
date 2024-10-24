import { describe, it, expect, vi } from 'vitest';
import { getAccountDomain } from '../../src/utils/get-account-domain';
import { Framework } from '@vechain/connex-framework';
import { DriverNoVendor } from '@vechain/connex-driver';

vi.mock('@vechain/connex-framework');

describe('getAccountDomain', () => {
    const mockDriver: DriverNoVendor = {
        genesis: {
            id: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
        },
    } as any;

    const mockFramework = {
        thor: {
            account: vi.fn().mockReturnThis(),
            method: vi.fn().mockReturnThis(),
            call: vi.fn(),
        },
    };

    beforeEach(() => {
        vi.mocked(Framework).mockReturnValue(mockFramework as any);
    });

    it('should return null if address is null', async () => {
        const result = await getAccountDomain({
            address: null,
            driver: mockDriver,
        });
        expect(result).toBeNull();
    });

    it('should return the domain name for a valid address', async () => {
        const mockAddress = '0x1234567890123456789012345678901234567890';
        const mockDomain = 'test.vet';

        mockFramework.thor.call.mockResolvedValue({
            decoded: { names: [mockDomain] },
        });

        const result = await getAccountDomain({
            address: mockAddress,
            driver: mockDriver,
        });

        expect(result).toBe(mockDomain);
        expect(mockFramework.thor.account).toHaveBeenCalledWith(
            '0xc403b8EA53F707d7d4de095f0A20bC491Cf2bc94',
        );
        expect(mockFramework.thor.method).toHaveBeenCalled();
        expect(mockFramework.thor.call).toHaveBeenCalledWith([mockAddress]);
    });

    it('should return null if no domain is found', async () => {
        const mockAddress = '0x1234567890123456789012345678901234567890';

        mockFramework.thor.call.mockResolvedValue({
            decoded: { names: [] },
        });

        const result = await getAccountDomain({
            address: mockAddress,
            driver: mockDriver,
        });

        expect(result).toBeNull();
    });

    it('should use test network resolver if genesis ID matches', async () => {
        const testDriver: DriverNoVendor = {
            genesis: {
                id: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            },
        } as any;

        await getAccountDomain({
            address: '0x1234567890123456789012345678901234567890',
            driver: testDriver,
        });

        expect(mockFramework.thor.account).toHaveBeenCalledWith(
            '0xc403b8EA53F707d7d4de095f0A20bC491Cf2bc94',
        );
    });
});
