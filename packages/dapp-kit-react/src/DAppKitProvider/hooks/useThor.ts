import { useContext } from 'react';
import { type DAppKitContext } from '../../types';
import { Context } from '../context';

/**
 * Hook to get the thor object from the DAppKitProvider
 */
export const useThor = (): DAppKitContext['thor'] => {
    const context = useContext(Context);

    if (!context) {
        throw new Error('"useThor" must be used within a DAppKitProvider');
    }

    return context.thor;
};
