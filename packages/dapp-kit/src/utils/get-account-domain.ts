import { ABIContract } from '@vechain/sdk-core';
import { ThorClient } from '@vechain/sdk-network';
import { genesisBlocks, VNS_RESOLVER } from '../constants';

/**
 * Get the domain of an account
 */
export const getAccountDomain = async ({
    address,
    thor,
}: {
    address: string | null;
    thor: ThorClient;
}): Promise<string | null> => {
    if (!address) return null;

    const domains = await getAccountDomains({ addresses: [address], thor });

    return domains[address] ?? null;
};

export const getAccountDomains = async ({
    addresses,
    thor,
}: {
    addresses: string[];
    thor: ThorClient;
}): Promise<Record<string, string | null>> => {
    if (addresses.length === 0) return {};

    const genesisId = await thor.blocks.getGenesisBlock();

    const resolver =
        genesisId?.id === genesisBlocks.test.id
            ? VNS_RESOLVER.test
            : VNS_RESOLVER.main;
    const normalizedAddresses = addresses.map((address) =>
        address.toLowerCase(),
    );

    const res = await thor.contracts.executeCall(
        resolver,
        ABIContract.ofAbi(VNS_RESOLVER.abi).getFunction('getNames'),
        [normalizedAddresses],
    );
    const resultArray = (res.result.array ?? []) as unknown[];
    const names = Array.isArray(resultArray[0])
        ? (resultArray[0] as string[])
        : (resultArray as string[]);

    return addresses.reduce<Record<string, string | null>>(
        (acc, address, i) => {
            acc[address] = names[i] || null;
            return acc;
        },
        {},
    );
};
