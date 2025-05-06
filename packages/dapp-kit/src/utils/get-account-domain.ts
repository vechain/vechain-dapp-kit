import { genesisBlocks, VNS_RESOLVER } from '../constants';
import { ThorClient } from '@vechain/sdk-network';
import { ABIContract } from '@vechain/sdk-core';

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

    const genesisId = await thor.blocks.getGenesisBlock();

    const resolver =
        genesisId?.id === genesisBlocks.test.id
            ? VNS_RESOLVER.test
            : VNS_RESOLVER.main;

    const res = await thor.contracts.executeCall(
        resolver,
        ABIContract.ofAbi(VNS_RESOLVER.abi).getFunction('getNames'),
        [[address]],
    );
    const resArray = res.result.array as string[];

    return (resArray[0] as string) || null;
};
