import { useContext } from 'react';
import { type DAppKitContext } from '../../types';
import { Context } from '../context';

/**
 * Hook to get the wallet modal object from the DAppKitProvider
 */
export const useWalletModal = (): DAppKitContext['modal'] => {
    const context = useContext(Context);

    if (!context) {
        throw new Error(
            '"useWalletModal" must be used within a ConnexProvider',
        );
    }
    return context.modal;
};
