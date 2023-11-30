import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import type { WalletSource } from '@vechainfoundation/dapp-kit';
import { DAppKitUI } from '@vechainfoundation/dapp-kit-ui';
import { subscribeKey } from 'valtio/utils';
import { DAppKitContext } from './types';
import type { DAppKitProviderOptions } from './types';

/**
 * Context
 */
const DAppKitContext = createContext<DAppKitContext | undefined>(undefined);

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
        subscribeKey(connex.wallet.state, 'address', (v) => setAccount(v));
        subscribeKey(connex.wallet.state, 'source', (v) => setSource(v));
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

    return (
        <DAppKitContext.Provider value={context}>
            {children}
        </DAppKitContext.Provider>
    );
};

export const useConnex = (): DAppKitContext['connex'] => {
    const context = useContext(DAppKitContext);

    if (!context) {
        throw new Error('"useConnex" must be used within a ConnexProvider');
    }

    return context.connex;
};

export const useWallet = (): DAppKitContext['wallet'] => {
    const context = useContext(DAppKitContext);

    if (!context) {
        throw new Error('"useWallet" must be used within a ConnexProvider');
    }

    return context.wallet;
};

export const useWalletModal = (): DAppKitContext['modal'] => {
    const context = useContext(DAppKitContext);

    if (!context) {
        throw new Error(
            '"useWalletModal" must be used within a ConnexProvider',
        );
    }
    return context.modal;
};
