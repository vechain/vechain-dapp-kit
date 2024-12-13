import { genesisBlocks } from '@vechain/dapp-kit';
import type { DAppKitContext } from '../../../types';
import { VNS_RESOLVER } from '../constants';
import { ABIContract } from '@vechain/sdk-core';

const vnsResolverABI = [
    {
        "inputs": [
            {
                "internalType": "string[]",
                "name": "names",
                "type": "string[]"
            }
        ],
        "name": "getAddresses",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "addresses",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "addresses",
                "type": "address[]"
            }
        ],
        "name": "getNames",
        "outputs": [
            {
                "internalType": "string[]",
                "name": "names",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string[]",
                "name": "names",
                "type": "string[]"
            }
        ],
        "name": "getNamehashes",
        "outputs": [
            {
                "internalType": "bytes32[]",
                "name": "nodes",
                "type": "bytes32[]"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    }
] as const;

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

    const res = await thor.contracts.executeCall(resolver, ABIContract.ofAbi(vnsResolverABI).getFunction('getNames'), [address]);
    const resArray = res.result.array as string[];

    return (resArray[0] as string) || undefined;
};
