import { genesisBlocks } from '../constants';
import { ThorClient } from '@vechain/sdk-network';
import { ABIContract } from '@vechain/sdk-core';

const VNS_RESOLVER = {
    main: '0xA11413086e163e41901bb81fdc5617c975Fa5a1A',
    test: '0xc403b8EA53F707d7d4de095f0A20bC491Cf2bc94',
};

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

    const res = await thor.contracts.executeCall(resolver, ABIContract.ofAbi(vnsResolverABI).getFunction('getNames'), [address]);
    const resArray = res.result.array as string[];

    return (resArray[0] as string) || null;
};
