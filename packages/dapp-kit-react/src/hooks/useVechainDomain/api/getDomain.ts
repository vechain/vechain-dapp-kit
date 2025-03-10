import { genesisBlocks, VNS_RESOLVER } from '@vechain/dapp-kit';
import type { DAppKitContext } from '../../../types';
import { ABIContract } from '@vechain/sdk-core';

/**
 * Get the domain of an account
 */
export const getDomain = async ({
    address,
    thor,
}: {
    address?: string | null;
    thor: DAppKitContext['thor'];
}): Promise<string | undefined> => {
    if (!address) return undefined;

    const genesisId = await thor.blocks.getGenesisBlock();

    const resolver =
        genesisId?.id === genesisBlocks.test.id
            ? VNS_RESOLVER.test
            : VNS_RESOLVER.main;

    const res = await thor.contracts.executeCall(
        resolver,
        ABIContract.ofAbi(VNS_RESOLVER.abi).getFunction('getNames'),
        [address],
    );
    const resArray = res.result.array as string[];

    return (resArray[0] as string) || undefined;
};
