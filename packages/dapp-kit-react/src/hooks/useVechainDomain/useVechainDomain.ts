import { useEffect, useState } from 'react';
import { useConnex } from '../../DAppKitProvider/hooks/useConnex';
import {
    fetchVechainDomain,
    type VechainDomainResult,
} from './api/fetchVechainDomain';

interface UseVechainDomainReturnType extends VechainDomainResult {
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
    const [result, setResult] = useState<VechainDomainResult>({
        address: undefined,
        domain: undefined,
        isValidAddressOrDomain: false,
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetchVechainDomain({ addressOrDomain, connex })
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
    }, [addressOrDomain, connex]);

    return { ...result, isLoading };
};
