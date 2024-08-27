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
import { type Certificate } from '@vechain/sdk-core';
import { subscribeKey } from 'valtio/vanilla/utils';
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
    requireCertificate,
    themeMode,
    themeVariables,
    i18n,
    language,
    modalParent,
    onSourceClick,
    connectionCertificate: connectionCertificateData,
}): React.ReactElement => {
    const dAppKit = useMemo(
        () =>
            DAppKitUI.configure({
                nodeUrl,
                genesis,
                walletConnectOptions,
                usePersistence,
                logLevel,
                requireCertificate,
                themeVariables,
                themeMode,
                i18n,
                language,
                modalParent,
                onSourceClick,
                connectionCertificate: connectionCertificateData,
            }),
        [
            nodeUrl,
            genesis,
            walletConnectOptions,
            usePersistence,
            logLevel,
            requireCertificate,
            themeVariables,
            themeMode,
            i18n,
            language,
            modalParent,
            onSourceClick,
            connectionCertificateData,
        ],
    );

    const [account, setAccount] = useState<string | null>(
        dAppKit.wallet.state.address,
    );
    const [source, setSource] = useState<WalletSource | null>(
        dAppKit.wallet.state.source,
    );
    const [connectionCertificate, setConnectionCertificate] =
        useState<Certificate | null>(
            dAppKit.wallet.state.connectionCertificate,
        );

    useEffect(() => {
        const addressSub = subscribeKey(
            dAppKit.wallet.state,
            'address',
            (v) => {
                setAccount(v);
            },
        );
        const sourceSub = subscribeKey(dAppKit.wallet.state, 'source', (v) => {
            setSource(v);
        });
        const certificateSub = subscribeKey(
            dAppKit.wallet.state,
            'connectionCertificate',
            (v) => {
                setConnectionCertificate(v);
            },
        );

        return () => {
            addressSub();
            sourceSub();
            certificateSub();
        };
    }, [dAppKit.wallet.state]);

    const openModal = useCallback(() => {
        DAppKitUI.modal.open();
    }, []);

    const closeModal = useCallback(() => {
        DAppKitUI.modal.close();
    }, []);
    const onModalConnected = useCallback(
        (callback: (address: string | null) => void) =>
            DAppKitUI.modal.onConnectionStatusChange(callback),
        [],
    );

    const context: DAppKitContext = useMemo(() => {
        return {
            sdk: {
                thor: dAppKit.thor,
            },
            wallet: {
                setSource: dAppKit.wallet.setSource,
                disconnect: dAppKit.wallet.disconnect,
                connect: dAppKit.wallet.connect,
                availableWallets: dAppKit.wallet.state.availableSources,
                account,
                source,
                connectionCertificate,
            },
            modal: {
                open: openModal,
                close: closeModal,
                onConnectionStatusChange: onModalConnected,
            },
        };
    }, [
        dAppKit,
        account,
        source,
        closeModal,
        openModal,
        onModalConnected,
        connectionCertificate,
    ]);

    return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useSDK = (): DAppKitContext['sdk'] => {
    const context = useContext(Context);

    if (!context) {
        throw new Error('"useSDK" must be used within a ConnexProvider');
    }

    return context.sdk;
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
