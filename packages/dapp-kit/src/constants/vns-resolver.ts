/**
 * The VNS resolver addresses and ABI
 */
export const VNS_RESOLVER = {
    main: '0xA11413086e163e41901bb81fdc5617c975Fa5a1A',
    test: '0xc403b8EA53F707d7d4de095f0A20bC491Cf2bc94',
    abi: [
        {
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
        },
        {
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
        },
        {
            inputs: [
                {
                    internalType: 'string[]',
                    name: 'names',
                    type: 'string[]',
                },
            ],
            name: 'getNamehashes',
            outputs: [
                {
                    internalType: 'bytes32[]',
                    name: 'nodes',
                    type: 'bytes32[]',
                },
            ],
            stateMutability: 'pure',
            type: 'function',
        },
    ],
} as const;
