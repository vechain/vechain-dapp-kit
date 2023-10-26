import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useReducer,
} from 'react';
import type { ConnexInstance } from '@vechain/wallet-kit';
import { createConnexInstance, WalletSource } from '@vechain/wallet-kit';
import { accountReducer, defaultAccountState } from './AccountReducer';
import type {
    ConnexContext,
    ConnexProviderOptions,
    SetAccount,
    SetSource,
} from './types';

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
        const wallets: WalletSource[] = [WalletSource.Sync2];

        if (window.vechain) {
            wallets.push(WalletSource.VeWorldExtension);
        }

        if (window.connex) {
            wallets.push(WalletSource.Sync);
        }

        if (walletConnectOptions) {
            wallets.push(WalletSource.WalletConnect);
        }

        return wallets;
    }, [walletConnectOptions]);

    const setSource: SetSource = useCallback(
        (wallet: WalletSource): void => {
            connexInstance.setSource(wallet);

            dispatch({
                type: 'set-wallet-source',
                payload: { source: wallet, persist: persistState },
            });
        },
        [connexInstance, persistState],
    );

    const setAccount: SetAccount = useCallback(
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
                wallets: Object.values(WalletSource),
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
