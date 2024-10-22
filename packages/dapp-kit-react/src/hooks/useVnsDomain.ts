import { useEffect, useState } from 'react';
import { genesisBlocks } from '@vechain/dapp-kit';
import { useConnex } from '../DAppKitProvider/hooks/useConnex';
import type { DAppKitContext } from '../types';

const VNS_RESOLVER = {
    main: '0xA11413086e163e41901bb81fdc5617c975Fa5a1A',
    test: '0xc403b8EA53F707d7d4de095f0A20bC491Cf2bc94',
};

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
const getDomain = async ({
    address,
    connex,
}: {
    address: string | null;
    connex: DAppKitContext['connex'];
}): Promise<string | null> => {
    if (!address) return null;

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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return (names?.[0] as string) || null;
};

interface UseVnsDomainReturnType {
    domain: string | null;
    isLoading: boolean;
}

/**
 * Hook to get the domain of an account by passing the connex object
 */
export const useVnsDomainByConnex = (props: {
    address: string | null;
    connex: DAppKitContext['connex'];
}): UseVnsDomainReturnType => {
    const { address, connex } = props;
    const [domain, setDomain] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (address) {
            setIsLoading(true);
            getDomain({ address, connex })
                .then(setDomain)
                .catch((err) => {
                    // eslint-disable-next-line no-console
                    console.error('Error getting domain: ', err);
                    setDomain(null);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setDomain(null);
        }
    }, [address, connex]);

    return { domain, isLoading };
};

/**
 * Hook to get the domain of an account
 */
export const useVnsDomain = (
    address: string | null,
): UseVnsDomainReturnType => {
    const connex = useConnex();
    return useVnsDomainByConnex({ address, connex });
};
