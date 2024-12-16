import { useContext } from 'react';
import { type DAppKitContext } from '../../types';
import { Context } from '../context';

/**
 * Hook to get the wallet object from the DAppKitProvider
 */
export const useWallet = (): DAppKitContext['wallet'] => {
    const context = useContext(Context);

    if (!context) {
        throw new Error('"useWallet" must be used within a DAppKitProvider');
    }

    return context.wallet;
};
