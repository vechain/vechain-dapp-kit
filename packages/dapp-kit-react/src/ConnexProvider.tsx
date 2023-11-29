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
import { subscribeKey } from 'valtio/utils';
import type { ConnexContext, ConnexProviderOptions } from './types';

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
    useWalletKitModal = false,
}): React.ReactElement => {
    const [account, setAccount] = useState<string | null>(null);
    const [source, setSource] = useState<WalletSource | null>(null);

    const connex = useMemo(
        () =>
            DAppKit.configure({
                nodeUrl: nodeOptions.node,
                genesis: nodeOptions.network,
                walletConnectOptions,
                useWalletKitModal,
                usePersistence: persistState,
            }),
        [
            persistState,
            useWalletKitModal,
            nodeOptions.network,
            nodeOptions.node,
            walletConnectOptions,
        ],
    );

    useEffect(() => {
        subscribeKey(connex.wallet.state, 'address', (v) => setAccount(v));
        subscribeKey(connex.wallet.state, 'source', (v) => setSource(v));
    }, [connex.wallet.state]);

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
                setSource: connex.wallet.setSource,
                disconnect: connex.wallet.disconnect,
                connect: connex.wallet.connect,
                availableWallets: connex.wallet.state.availableSources,
                account,
                source,
            },
            modal: {
                open: openModal,
                close: closeModal,
            },
        };
    }, [connex, account, source, closeModal, openModal]);

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
