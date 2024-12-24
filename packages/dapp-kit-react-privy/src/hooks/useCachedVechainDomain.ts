import { useVechainDomain } from '@vechain/dapp-kit-react';

interface VeChainDomainResult {
    address?: string;
    domain?: string;
    isValidAddressOrDomain: boolean;
    isLoading: boolean;
}

interface CachedVeChainDomainResult {
    domainResult: VeChainDomainResult;
    getCachedDomain: () => string | null;
    saveCachedDomain: (domain: string) => void;
}

const DOMAIN_CACHE_KEY = 'vechainDomainCache';
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours
export const useCachedVeChainDomain = (
    address: string,
): CachedVeChainDomainResult => {
    const domainResult = useVechainDomain({ addressOrDomain: address });

    // Try to get from cache first
    const getCachedDomain = (): string | null => {
        const cachedData = localStorage.getItem(DOMAIN_CACHE_KEY);
        if (cachedData) {
            const cachedDomains = JSON.parse(cachedData);
            const cachedDomain = cachedDomains.find(
                (domain: {
                    address: string;
                    domain: string;
                    timestamp: number;
                }) => domain.address === address,
            );
            if (cachedDomain) {
                const currentTime = Date.now();
                if (currentTime - cachedDomain.timestamp < CACHE_EXPIRY_TIME) {
                    return cachedDomain.domain;
                }
            }
        }
        return null;
    };

    // Save to cache
    const saveCachedDomain = (domain: string) => {
        const cachedData = localStorage.getItem(DOMAIN_CACHE_KEY);
        const cachedDomains = cachedData ? JSON.parse(cachedData) : [];
        const cachedDomain = cachedDomains.find(
            (domain: { address: string; domain: string; timestamp: number }) =>
                domain.address === address,
        );
        if (cachedDomain) {
            cachedDomain.domain = domain;
            cachedDomain.timestamp = Date.now();
        } else {
            cachedDomains.push({ address, domain, timestamp: Date.now() });
        }
        localStorage.setItem(DOMAIN_CACHE_KEY, JSON.stringify(cachedDomains));
    };

    return {
        domainResult,
        getCachedDomain,
        saveCachedDomain,
    };
};
