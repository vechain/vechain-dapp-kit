import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import type { WalletSource } from '@vechain/dapp-kit';
import { DAppKitUI } from '@vechain/dapp-kit-ui';
import { subscribeKey } from 'valtio/utils';
import type { DAppKitProviderOptions, DAppKitContext } from './types';

/**
 * Context
 */
const Context = createContext<DAppKitContext | undefined>(undefined);

export const DAppKitProvider: React.FC<DAppKitProviderOptions> = ({
    children,
    nodeUrl,
    genesis,
    walletConnectOptions,
    usePersistence = false,
    logLevel,
}): React.ReactElement => {
    const connex = useMemo(
        () =>
            DAppKitUI.configure({
                nodeUrl,
                genesis,
                walletConnectOptions,
                usePersistence,
                logLevel,
            }),
        [nodeUrl, genesis, walletConnectOptions, usePersistence, logLevel],
    );

    const [account, setAccount] = useState<string | null>(
        connex.wallet.state.address,
    );
    const [source, setSource] = useState<WalletSource | null>(
        connex.wallet.state.source,
    );

    useEffect(() => {
        const addressSub = subscribeKey(connex.wallet.state, 'address', (v) =>
            setAccount(v),
        );
        const sourceSub = subscribeKey(connex.wallet.state, 'source', (v) =>
            setSource(v),
        );

        return () => {
            addressSub();
            sourceSub();
        };
    }, [connex.wallet.state]);

    const openModal = useCallback(() => {
        DAppKitUI.modal.open();
    }, []);

    const closeModal = useCallback(() => {
        DAppKitUI.modal.close();
    }, []);

    const context: DAppKitContext = useMemo(() => {
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

    return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useConnex = (): DAppKitContext['connex'] => {
    const context = useContext(Context);

    if (!context) {
        throw new Error('"useConnex" must be used within a ConnexProvider');
    }

    return context.connex;
};

export const useWallet = (): DAppKitContext['wallet'] => {
    const context = useContext(Context);

    if (!context) {
        throw new Error('"useWallet" must be used within a ConnexProvider');
    }

    return context.wallet;
};

export const useWalletModal = (): DAppKitContext['modal'] => {
    const context = useContext(Context);

    if (!context) {
        throw new Error(
            '"useWalletModal" must be used within a ConnexProvider',
        );
    }
    return context.modal;
};
