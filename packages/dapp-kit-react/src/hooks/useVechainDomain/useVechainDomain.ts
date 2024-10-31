import { useEffect, useState } from 'react';
import { addressUtils } from '@vechain/sdk-core';
import { useConnex } from '../../DAppKitProvider/hooks/useConnex';
import { getDomain } from './api/getDomain';
import { getAddress } from './api/getAddress';

interface UseVechainDomainReturnType {
    address: string | undefined;
    domain: string | undefined;
    isLoading: boolean;
    isValidAddressOrDomain: boolean;
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

    const [address, setAddress] = useState<string | undefined>(undefined);
    const [domain, setDomain] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidAddressOrDomain, setIsValidAddressOrDomain] = useState(false);

    const isFalsy = !addressOrDomain;
    const isValidAddress = !isFalsy && addressUtils.isAddress(addressOrDomain);

    useEffect(() => {
        if (isFalsy) {
            setAddress(undefined);
            setDomain(undefined);
            setIsLoading(false);
            setIsValidAddressOrDomain(false);
            return;
        }

        // if the addressOrDomain is an address, get the domain
        if (isValidAddress) {
            setAddress(addressOrDomain);
            setIsValidAddressOrDomain(true);
            setIsLoading(true);
            getDomain({ address: addressOrDomain, connex })
                .then((domainAddress) => {
                    setDomain(domainAddress);
                })
                .catch((err) => {
                    console.error('Error getting domain: ', err);
                    setDomain(undefined);
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
                if (
                    domainAddress ===
                    '0x0000000000000000000000000000000000000000'
                ) {
                    setDomain(undefined);
                    setAddress(undefined);
                    setIsValidAddressOrDomain(false);
                    return;
                }
                setDomain(addressOrDomain);
                setAddress(domainAddress);
                setIsValidAddressOrDomain(true);
            })
            .catch((err) => {
                console.error('Error getting address: ', err);
                setAddress(undefined);
                setDomain(undefined);
                setIsValidAddressOrDomain(false);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [addressOrDomain, connex]);

    return { address, domain, isLoading, isValidAddressOrDomain };
};
