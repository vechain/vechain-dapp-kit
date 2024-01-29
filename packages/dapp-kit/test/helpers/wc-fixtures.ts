import type { SessionTypes, SignClientTypes } from '@walletconnect/types';
import { normalizeGenesisBlock, DefaultMethods } from '../../src';
import { address } from './mocked-signer';

const wcMetadata: SignClientTypes.Options['metadata'] = {
    name: 'test',
    description: 'test',
    icons: ['test'],
    url: 'test',
};

const defaultWcChains = [
    `vechain:${normalizeGenesisBlock('main').id.slice(-32)}`,
];

export const wcSessionStruct: SessionTypes.Struct = {
    topic: 'wc-topic',
    pairingTopic: 'wc-pairing-topic',
    relay: {
        protocol: 'irn',
    },
    expiry: 0,
    acknowledged: true,
    controller: 'wc-controller',
    namespaces: {
        vechain: {
            chains: defaultWcChains,
            accounts: defaultWcChains.map((chain) => `${chain}:${address}`),
            methods: [
                DefaultMethods.RequestTransaction,
                DefaultMethods.SignCertificate,
            ],
            events: [],
        },
    },
    requiredNamespaces: {
        vechain: {
            chains: defaultWcChains,
            methods: [
                DefaultMethods.RequestTransaction,
                DefaultMethods.SignCertificate,
            ],
            events: [],
        },
    },
    optionalNamespaces: {},
    self: {
        publicKey: 'wc-public-key',
        metadata: wcMetadata,
    },
    peer: {
        publicKey: 'wc-public-key',
        metadata: wcMetadata,
    },
};
