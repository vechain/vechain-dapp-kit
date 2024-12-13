import { useContext } from 'react';
import { type DAppKitContext } from '../../types';
import { Context } from '../context';

/**
 * Hook to get the connex object from the DAppKitProvider
 */
export const useConnex = (): DAppKitContext['connex'] => {
    const context = useContext(Context);

    if (!context) {
        throw new Error('"useConnex" must be used within a ConnexProvider');
    }

    return context.connex;
};
