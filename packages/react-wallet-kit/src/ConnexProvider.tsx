import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import type { WalletSource } from '@vechain/wallet-kit';
import { MultiWalletConnex } from '@vechain/wallet-kit';
import type { ConnexContext, ConnexProviderOptions } from './types';

const STORAGE_PREFIX = '@vechain/wallet-kit';
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
const Context = createContext<ConnexContext>({} as ConnexContext);

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
            new MultiWalletConnex({
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
