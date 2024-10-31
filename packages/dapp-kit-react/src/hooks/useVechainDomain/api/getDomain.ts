import { genesisBlocks } from '@vechain/dapp-kit';
import type { DAppKitContext } from '../../../types';
import { VNS_RESOLVER } from '../constants';

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
export const getDomain = async ({
    address,
    connex,
}: {
    address?: string | null;
    connex: DAppKitContext['connex'];
}): Promise<string | undefined> => {
    if (!address) return undefined;

    const resolver =
        connex.thor.genesis.id === genesisBlocks.test.id
            ? VNS_RESOLVER.test
            : VNS_RESOLVER.main;

    const res = await connex.thor
        .account(resolver)
        .method(getNamesABI)
        .call([address]);

    const {
        decoded: { names },
    } = res;

    return (names?.[0] as string) || undefined;
};
