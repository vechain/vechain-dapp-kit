import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { VOT3_CONTRACT } from "../utils/consts";
import { FixedPointNumber, Units } from "@vechain/sdk-core";

export const useVOT3Balance = ({
    address
}: {
    address: string;
}): UseQueryResult<string, unknown> => {
    return useQuery({
        queryKey: ["useVOT3Balance", address],
        queryFn: async () => {
            if (address !== null && address !== undefined && address === '') {
                return '0';
            }
            try {
                const balanceVOT3 = (
                    await VOT3_CONTRACT.read.balanceOf(address)
                )[0] as bigint;

                return Units.formatEther(
                    FixedPointNumber.of(balanceVOT3)
                );
            } catch (error) {
                console.error('Failed to fetch VOT3 balance:', error);
                return 'error';
            }
        },
        staleTime: 3000,
        refetchInterval: 10000,
        enabled: address !== null && address !== undefined && address !== ''
    });
};
