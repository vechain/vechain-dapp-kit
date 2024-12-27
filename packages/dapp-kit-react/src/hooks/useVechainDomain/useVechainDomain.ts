import { useEffect, useState } from 'react';
import { useThor } from '../../DAppKitProvider/hooks/useThor';
import {
    fetchVechainDomain,
    type VeChainDomainResult,
} from './api/fetchVechainDomain';

interface UseVechainDomainReturnType extends VeChainDomainResult {
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
    const thor = useThor();
    const [result, setResult] = useState<VeChainDomainResult>({
        address: undefined,
        domain: undefined,
        isValidAddressOrDomain: false,
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetchVechainDomain({ addressOrDomain, thor })
            .then(setResult)
            .catch((err) => {
                console.error('Error fetching vechain domain: ', err);
                setResult({
                    address: undefined,
                    domain: undefined,
                    isValidAddressOrDomain: false,
                });
            })
            .finally(() => setIsLoading(false));
    }, [addressOrDomain, thor]);

    return { ...result, isLoading };
};
