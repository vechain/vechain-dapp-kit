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

    const res = await thor.contracts.executeCall(resolver, ABIContract.ofAbi(vnsResolverABI).getFunction('getAddresses'), [domain]);
    const resArray = res.result.array as string[];

    return (resArray[0] as string) || undefined;
};
