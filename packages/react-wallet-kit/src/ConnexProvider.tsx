import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useReducer,
} from 'react';
import type { ConnexInstance } from '@vechain/wallet-kit';
import { createConnexInstance, WalletSources } from '@vechain/wallet-kit';
import type { WalletSource } from '@vechain/wallet-kit/src/types';
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

    const connex: ConnexInstance = useMemo(
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

        void connex.wallet.disconnect();
    }, [connex]);

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
            connex.wallet.setSource(wallet);

            dispatch({
                type: 'set-wallet-source',
                payload: { source: wallet, persist: persistState },
            });
        },
        [connex, persistState],
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
                thor: connex.thor,
                vendor: connex.vendor,
            },
            wallet: {
                setSource,
                setAccount,
                availableWallets,
                wallets: WalletSources,
                accountState,
                disconnect,
                connect: connex.wallet.connect,
            },
        };
    }, [
        accountState,
        connex,
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
