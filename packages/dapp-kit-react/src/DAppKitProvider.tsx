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
import { subscribeKey } from 'valtio/vanilla/utils';
import type { DAppKitProviderOptions, DAppKitContext } from './types';
import { Certificate } from '@vechain/sdk-core';

/**
 * Context
 */
const Context = createContext<DAppKitContext | undefined>(undefined);

export const DAppKitProvider: React.FC<DAppKitProviderOptions> = ({
    children,
    nodeUrl,
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
    const dappKit = useMemo(
        () =>
            DAppKitUI.configure({
                nodeUrl,
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
        dappKit.wallet.state.address,
    );
    const [source, setSource] = useState<WalletSource | null>(
        dappKit.wallet.state.source,
    );
    const [connectionCertificate, setConnectionCertificate] =
        useState<Certificate | null>(
            dappKit.wallet.state.connectionCertificate,
        );

    useEffect(() => {
        const addressSub = subscribeKey(
            dappKit.wallet.state,
            'address',
            (v) => {
                setAccount(v);
            },
        );
        const sourceSub = subscribeKey(dappKit.wallet.state, 'source', (v) => {
            setSource(v);
        });
        const certificateSub = subscribeKey(
            dappKit.wallet.state,
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
    }, [dappKit.wallet.state]);

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
            thor: dappKit.thor,
            wallet: {
                setSource: dappKit.wallet.setSource,
                disconnect: dappKit.wallet.disconnect,
                connect: dappKit.wallet.connect,
                availableWallets: dappKit.wallet.state.availableSources,
                signCertificate: dappKit.wallet.signCert,
                requestTransaction: dappKit.wallet.requestTransaction,
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
        dappKit,
        account,
        source,
        closeModal,
        openModal,
        onModalConnected,
        connectionCertificate,
    ]);

    return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useThor = (): DAppKitContext['thor'] => {
    const context = useContext(Context);

    if (!context) {
        throw new Error('"useConnex" must be used within a ConnexProvider');
    }

    return context.thor;
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
