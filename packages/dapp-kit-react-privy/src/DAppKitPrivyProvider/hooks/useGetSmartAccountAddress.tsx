import { useState, useEffect } from 'react';
import { ABIContract } from '@vechain/sdk-core';
import { THOR_CLIENT } from '../utils';
import { SimpleAccountFactoryABI } from '../assets';

interface UseGetSmartAccountAddressReturnType {
    address: string | undefined;
    isLoading: boolean;
    error: Error | null;
}

/**
 * Hook to get the smart account address for a given owner address
 * @param ownerAddress The address of the smart account owner
 * @returns The smart account address and loading/error states
 */
export const useGetSmartAccountAddress = (
    ownerAddress?: string,
): UseGetSmartAccountAddressReturnType => {
    const [address, setAddress] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchSmartAccountAddress = async () => {
            if (!ownerAddress) {
                setAddress(undefined);
                return;
            }

            setIsLoading(true);
            try {
                const account = await THOR_CLIENT.contracts.executeCall(
                    process.env.NEXT_PUBLIC_AA_FACTORY as string,
                    ABIContract.ofAbi(SimpleAccountFactoryABI).getFunction(
                        'getAccountAddress',
                    ),
                    [ownerAddress],
                );

                setAddress(String(account.result.array?.[0]));
                setError(null);
            } catch (e) {
                console.error('Error fetching smart account address:', e);
                setError(e instanceof Error ? e : new Error('Unknown error'));
                setAddress(undefined);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSmartAccountAddress();
    }, [ownerAddress]);

    return { address, isLoading, error };
};
