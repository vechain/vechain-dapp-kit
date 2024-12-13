import { type DriverNoVendor } from '@vechain/connex-driver';
import { Framework } from '@vechain/connex-framework';
import { genesisBlocks } from '../constants';

const VNS_RESOLVER = {
    main: '0xA11413086e163e41901bb81fdc5617c975Fa5a1A',
    test: '0xc403b8EA53F707d7d4de095f0A20bC491Cf2bc94',
};

const getNamesABI = {
    inputs: [
        {
            internalType: 'address[]',
            name: 'addresses',
            type: 'address[]',
        },
    ],
    name: 'getNames',
    outputs: [
        {
            internalType: 'string[]',
            name: 'names',
            type: 'string[]',
        },
    ],
    stateMutability: 'view',
    type: 'function',
};

/**
 * Get the domain of an account
 */
export const getAccountDomain = async ({
    address,
    driver,
}: {
    address: string | null;
    driver: DriverNoVendor;
}): Promise<string | null> => {
    if (!address) return null;

    const framework = new Framework(driver);

    const resolver =
        driver.genesis.id === genesisBlocks.test.id
            ? VNS_RESOLVER.test
            : VNS_RESOLVER.main;

    const res = await framework.thor
        .account(resolver)
        .method(getNamesABI)
        .call([address]);

    const {
        decoded: { names },
    } = res;

    return (names?.[0] as string) || null;
};
