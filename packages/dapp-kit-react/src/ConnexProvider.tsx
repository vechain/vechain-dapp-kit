import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import type { WalletSource } from '@vechainfoundation/dapp-kit';
import { DAppKit } from '@vechainfoundation/dapp-kit-ui';
import type { ConnexContext, ConnexProviderOptions } from './types';

const STORAGE_PREFIX = '@vechainfoundation/dapp-kit';
const persist = (key: 'source' | 'account', value: string): void => {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, value);
};

const retrieve = (key: 'source' | 'account'): string | null => {
    return localStorage.getItem(`${STORAGE_PREFIX}${key}`);
};

const remove = (key: 'source' | 'account'): void => {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
};

/**
 * Context
 */
const ConnexProviderContext = createContext<ConnexContext | undefined>(
    undefined,
);

export const ConnexProvider: React.FC<ConnexProviderOptions> = ({
    children,
    nodeOptions,
    walletConnectOptions,
    persistState = false,
}): React.ReactElement => {
    const [account, setAccount] = useState<string | null>(
        persistState ? retrieve('account') : null,
    );
    const [source, setSource] = useState<WalletSource | null>(
        persistState ? (retrieve('source') as WalletSource) : null,
    );

    const connex = useMemo(
        () =>
            DAppKit.configure({
                nodeUrl: nodeOptions.node,
                genesis: nodeOptions.network,
                walletConnectOptions,
            }),
        [nodeOptions.network, nodeOptions.node, walletConnectOptions],
    );

    /**
     * Run at start - Set wallet source if it was persisted
     */
    useEffect(() => {
        const instanceSource = connex.wallet.getSource();

        if (source && !instanceSource) {
            connex.wallet.setSource(source);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const availableWallets: WalletSource[] = useMemo(() => {
        return connex.wallet.getAvailableSources();
    }, [connex.wallet]);

    useEffect(() => {
        const onDisconnected = (): void => {
            setAccount(null);
            setSource(null);

            if (persistState) {
                remove('account');
                remove('source');
            }
        };

        const onSourceChanged = (_src: WalletSource | null): void => {
            setSource(_src);

            if (persistState) {
                _src ? persist('source', _src) : remove('source');
            }
        };

        connex.wallet.onDisconnected(onDisconnected);
        connex.wallet.onSourceChanged(onSourceChanged);

        return () => {
            connex.wallet.removeOnDisconnected(onDisconnected);
            connex.wallet.removeOnSourceChanged(onSourceChanged);
        };
    }, [connex.wallet, persistState]);

    const connect = useCallback(async () => {
        const res = await connex.wallet.connect();

        setAccount(res.account);

        if (persistState) {
            persist('account', res.account);
        }

        return res;
    }, [persistState, connex.wallet, setAccount]);

    const disconnect = useCallback(async () => {
        await connex.wallet.disconnect();

        setAccount(null);
        setSource(null);

        if (persistState) {
            remove('account');
            remove('source');
        }
    }, [persistState, connex.wallet]);

    const updateSource = useCallback(
        (_source: WalletSource) => {
            connex.wallet.setSource(_source);
        },
        [connex.wallet],
    );

    const updateAccount = useCallback(
        (_account: string) => {
            setAccount(_account);

            if (persistState) {
                persist('account', _account);
            }
        },
        [persistState],
    );

    const openModal = useCallback(() => {
        DAppKit.modal.open();
    }, []);

    const closeModal = useCallback(() => {
        DAppKit.modal.close();
    }, []);

    const context: ConnexContext = useMemo(() => {
        return {
            connex: {
                thor: connex.thor,
                vendor: connex.vendor,
            },
            wallet: {
                setSource: updateSource,
                setAccount: updateAccount,
                disconnect,
                connect,
                availableWallets,
                account,
                source,
            },
            modal: {
                open: openModal,
                close: closeModal,
            },
        };
    }, [
        connex.thor,
        connex.vendor,
        updateSource,
        updateAccount,
        disconnect,
        connect,
        availableWallets,
        account,
        source,
        closeModal,
        openModal,
    ]);

    return (
        <ConnexProviderContext.Provider value={context}>
            {children}
        </ConnexProviderContext.Provider>
    );
};

export const useConnex = (): ConnexContext['connex'] => {
    const context = useContext(ConnexProviderContext);

    if (!context) {
        throw new Error('"useConnex" must be used within a ConnexProvider');
    }

    return context.connex;
};

export const useWallet = (): ConnexContext['wallet'] => {
    const context = useContext(ConnexProviderContext);

    if (!context) {
        throw new Error('"useWallet" must be used within a ConnexProvider');
    }

    return context.wallet;
};

export const useWalletModal = (): ConnexContext['modal'] => {
    const context = useContext(ConnexProviderContext);

    if (!context) {
        throw new Error(
            '"useWalletModal" must be used within a ConnexProvider',
        );
    }
    return context.modal;
};
