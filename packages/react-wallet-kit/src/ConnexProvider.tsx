import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useReducer,
} from 'react';
import type { ConnexInstance, WalletSource } from '@vechain/wallet-kit';
import { createConnexInstance, WalletMapping } from '@vechain/wallet-kit';
import { accountReducer, defaultAccountState } from './AccountReducer';
import type { ConnexContext, ConnexProviderOptions } from './types';

/**
 * Context
 */
const Context = createContext<ConnexContext>({} as ConnexContext);

export const ConnexProvider: React.FC<ConnexProviderOptions> = ({
    children,
    nodeOptions,
    walletConnectOptions,
    persistState = false,
}): React.ReactElement => {
    const [accountState, dispatch] = useReducer(
        accountReducer,
        defaultAccountState,
    );

    const onDisconnected = useCallback((): void => {
        dispatch({ type: 'clear' });
    }, []);

    const connexInstance: ConnexInstance = useMemo(
        () =>
            createConnexInstance({
                nodeUrl: nodeOptions.node,
                genesis: nodeOptions.network,
                source: accountState.source ?? undefined,
                walletConnectOptions,
                onDisconnected,
            }),
        //eslint-disable-next-line react-hooks/exhaustive-deps
        [
            nodeOptions.node,
            nodeOptions.network,
            walletConnectOptions,
            onDisconnected,
        ],
    );

    const disconnect = useCallback((): void => {
        dispatch({ type: 'clear' });

        connexInstance.disconnect().catch(() => {
            // do nothing
        });
    }, [connexInstance]);

    const availableWallets = useMemo(() => {
        const wallets: WalletSource[] = ['sync2'];

        if (window.vechain) {
            wallets.push('veworld-extension');
        }

        if (window.connex) {
            wallets.push('sync');
        }

        if (walletConnectOptions) {
            wallets.push('wallet-connect');
        }

        return wallets;
    }, [walletConnectOptions]);

    const setSource = useCallback(
        (wallet: WalletSource): void => {
            connexInstance.setSource(wallet);

            dispatch({
                type: 'set-wallet-source',
                payload: { source: wallet, persist: persistState },
            });
        },
        [connexInstance, persistState],
    );

    const setAccount = useCallback(
        (address: string) => {
            dispatch({
                type: 'set-address',
                payload: { address, persist: persistState },
            });
        },
        [persistState],
    );

    const context: ConnexContext = useMemo(() => {
        return {
            connex: {
                thor: connexInstance.thor,
                vendor: connexInstance.vendor,
            },
            wallet: {
                setSource,
                setAccount,
                availableWallets,
                wallets: Object.keys(WalletMapping) as WalletSource[],
                accountState,
                disconnect,
            },
        };
    }, [
        accountState,
        connexInstance,
        setAccount,
        setSource,
        availableWallets,
        disconnect,
    ]);

    return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useConnex = (): ConnexContext['connex'] => {
    const context = useContext(Context);
    return context.connex;
};

export const useWallet = (): ConnexContext['wallet'] => {
    const context = useContext(Context);
    return context.wallet;
};
