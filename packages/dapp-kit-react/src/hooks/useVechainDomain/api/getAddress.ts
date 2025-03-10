import { genesisBlocks, VNS_RESOLVER } from '@vechain/dapp-kit';
import type { DAppKitContext } from '../../../types';
import { ABIContract } from '@vechain/sdk-core';

/**
 * Get the address of the domain
 */
export const getAddress = async ({
    domain,
    thor,
}: {
    domain: string | null;
    thor: DAppKitContext['thor'];
}): Promise<string | undefined> => {
    if (!domain) return undefined;

    const genesisId = await thor.blocks.getGenesisBlock();

    const resolver =
        genesisId?.id === genesisBlocks.test.id
            ? VNS_RESOLVER.test
            : VNS_RESOLVER.main;

    const res = await thor.contracts.executeCall(
        resolver,
        ABIContract.ofAbi(VNS_RESOLVER.abi).getFunction('getAddresses'),
        [domain],
    );
    const resArray = res.result.array as string[];

    return (resArray[0] as string) || undefined;
};
