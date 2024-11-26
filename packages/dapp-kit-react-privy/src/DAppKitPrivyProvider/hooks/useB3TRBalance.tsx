import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { B3TR_CONTRACT } from "../utils/consts";
import { FixedPointNumber, Units } from "@vechain/sdk-core";

export const useB3TRBalance = ({
    address
}: {
    address: string;
}): UseQueryResult<string, unknown> => {
    return useQuery({
        queryKey: ["useB3TRBalance", address],
        queryFn: async () => {
            if (address !== null && address !== undefined && address === '') {
                return '0';
            }
            try {
                const balanceB3TR = (
                    await B3TR_CONTRACT.read.balanceOf(address)
                )[0] as bigint;

                return Units.formatEther(
                    FixedPointNumber.of(balanceB3TR)
                );
            } catch (error) {
                console.error('Failed to fetch B3TR balance:', error);
                return 'error';
            }
        },
        staleTime: 3000,
        refetchInterval: 10000,
        enabled: address !== null && address !== undefined && address !== ''
    });
};
