import { genesisBlocks } from '@vechain/dapp-kit';
import type { DAppKitContext } from '../../../types';
import { VNS_RESOLVER } from '../constants';

const getAddressesABI = {
    inputs: [
        {
            internalType: 'string[]',
            name: 'names',
            type: 'string[]',
        },
    ],
    name: 'getAddresses',
    outputs: [
        {
            internalType: 'address[]',
            name: 'addresses',
            type: 'address[]',
        },
    ],
    stateMutability: 'view',
    type: 'function',
};

/**
 * Get the address of the domain
 */
export const getAddress = async ({
    domain,
    connex,
}: {
    domain: string | null;
    connex: DAppKitContext['connex'];
}): Promise<string | null> => {
    if (!domain) return null;

    const resolver =
        connex.thor.genesis.id === genesisBlocks.test.id
            ? VNS_RESOLVER.test
            : VNS_RESOLVER.main;

    const res = await connex.thor
        .account(resolver)
        .method(getAddressesABI)
        .call([domain]);

    const {
        decoded: { addresses },
    } = res;

    return (addresses?.[0] as string) || null;
};
