import { useEffect, useState } from 'react';
import { addressUtils } from '@vechain/sdk-core';
import { useConnex } from '../../DAppKitProvider/hooks/useConnex';
import { getDomain } from './api/getDomain';
import { getAddress } from './api/getAddress';

interface UseVechainDomainReturnType {
    address: string | null;
    domain: string | null;
    isLoading: boolean;
}

/**
 * Hook to get the domain of an account and vice versa by passing the connex object
 */
export const useVechainDomain = ({
    addressOrDomain,
}: {
    addressOrDomain?: string | null;
}): UseVechainDomainReturnType => {
    const connex = useConnex();

    const [address, setAddress] = useState<string | null>(null);
    const [domain, setDomain] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const isFalsy = !addressOrDomain;
    const isValidAddress = !isFalsy && addressUtils.isAddress(addressOrDomain);

    useEffect(() => {
        if (isFalsy) {
            setAddress(null);
            setDomain(null);
            setIsLoading(false);
            return;
        }

        // if the addressOrDomain is an address, get the domain
        if (isValidAddress) {
            setAddress(addressOrDomain);
            setIsLoading(true);
            getDomain({ address: addressOrDomain, connex })
                .then(setDomain)
                .catch((err) => {
                    console.error('Error getting domain: ', err);
                    setDomain(null);
                })
                .finally(() => {
                    setIsLoading(false);
                });

            return;
        }

        // if the addressOrDomain is a domain, get the address
        setIsLoading(true);
        getAddress({ domain: addressOrDomain, connex })
            .then((domainAddress) => {
                setDomain(addressOrDomain);
                setAddress(domainAddress);
            })
            .catch((err) => {
                console.error('Error getting address: ', err);
                setAddress(null);
                setDomain(null);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [addressOrDomain, connex]);

    return { address, domain, isLoading };
};
