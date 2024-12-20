import { useConnex } from '@vechain/dapp-kit-react';

/**
 *
 * @returns  the current block
 */
export const useCurrentBlock = () => {
    const { thor } = useConnex();

    return thor.status.head;
};
