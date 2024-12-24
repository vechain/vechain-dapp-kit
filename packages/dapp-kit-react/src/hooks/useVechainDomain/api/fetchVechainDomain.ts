import { addressUtils } from '@vechain/sdk-core';
import type { DAppKitContext } from '../../../types';
import { getDomain } from './getDomain';
import { getAddress } from './getAddress';

export interface VeChainDomainResult {
    address: string | undefined;
    domain: string | undefined;
    isValidAddressOrDomain: boolean;
}

/**
 * Function to fetch the vechain domain of an account and vice versa by passing the connex object
 */
export const fetchVechainDomain = async ({
    addressOrDomain,
    connex,
}: {
    addressOrDomain?: string | null;
    connex: DAppKitContext['connex'];
}): Promise<VeChainDomainResult> => {
    if (!addressOrDomain) {
        return {
            address: undefined,
            domain: undefined,
            isValidAddressOrDomain: false,
        };
    }

    const isValidAddress = addressUtils.isAddress(addressOrDomain);

    if (isValidAddress) {
        try {
            const domainName = await getDomain({
                address: addressOrDomain,
                connex,
            });
            return {
                address: addressOrDomain,
                domain: domainName,
                isValidAddressOrDomain: true,
            };
        } catch (err) {
            console.error('Error getting domain: ', err);
            return {
                address: addressOrDomain,
                domain: undefined,
                isValidAddressOrDomain: true,
            };
        }
    }

    try {
        const domainAddress = await getAddress({
            domain: addressOrDomain,
            connex,
        });
        if (domainAddress === '0x0000000000000000000000000000000000000000') {
            return {
                address: undefined,
                domain: undefined,
                isValidAddressOrDomain: false,
            };
        }
        return {
            address: domainAddress,
            domain: addressOrDomain,
            isValidAddressOrDomain: true,
        };
    } catch (err) {
        console.error('Error getting address: ', err);
        return {
            address: undefined,
            domain: undefined,
            isValidAddressOrDomain: false,
        };
    }
};
