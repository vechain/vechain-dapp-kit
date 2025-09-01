import {
    DAppKitLogger,
    type DAppKit,
    type WalletSource,
} from '@vechain/dapp-kit';
import { DAppKitUI } from '@vechain/dapp-kit-ui';
import type { CertificateData } from '@vechain/sdk-core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { subscribeKey } from 'valtio/vanilla/utils';
import type { DAppKitContext, DAppKitProviderOptions } from '../types';
import { Context } from './context';

export const DAppKitProviderData = ({
    children,
    dAppKit,
    initialized,
}: {
    children: React.ReactNode;
    dAppKit: DAppKit;
    initialized: boolean;
}): React.ReactElement => {
    const [account, setAccount] = useState<string | null>(
        dAppKit.wallet.state.address,
    );
    const [accountDomain, setAccountDomain] = useState<string | null>(
        dAppKit.wallet.state.accountDomain,
    );
    const [isAccountDomainLoading, setIsAccountDomainLoading] = useState(
        dAppKit.wallet.state.isAccountDomainLoading,
    );
    const [source, setSource] = useState<WalletSource | null>(
        dAppKit.wallet.state.source,
    );
    const [connectionCertificate, setConnectionCertificate] =
        useState<CertificateData | null>(
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
        const domainSub = subscribeKey(
            dAppKit.wallet.state,
            'accountDomain',
            (v) => {
                setAccountDomain(v);
            },
        );
        const isAccountDomainLoadingSub = subscribeKey(
            dAppKit.wallet.state,
            'isAccountDomainLoading',
            (v) => {
                setIsAccountDomainLoading(v);
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
            domainSub();
            isAccountDomainLoadingSub();
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
            thor: dAppKit.thor,
            wallet: {
                setSource: dAppKit.wallet.setSource,
                disconnect: dAppKit.wallet.disconnect,
                connect: dAppKit.wallet.connect,
                signer: dAppKit.signer,
                availableWallets: dAppKit.wallet.state.availableSources,
                account,
                accountDomain,
                isAccountDomainLoading,
                source,
                connectionCertificate,
                requestCertificate: dAppKit.wallet.signCert,
                requestTransaction: dAppKit.wallet.signTx,
                requestTypedData: dAppKit.wallet.signTypedData,
                switchWallet: dAppKit.wallet.switchWallet,
                initializeAsync: dAppKit.wallet.initializeStateAsync,
                connectV2: dAppKit.wallet.connectV2,
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
        accountDomain,
        isAccountDomainLoading,
        source,
        connectionCertificate,
        openModal,
        closeModal,
        onModalConnected,
    ]);

    return (
        <Context.Provider value={context}>
            {initialized ? children : null}
        </Context.Provider>
    );
};

export const DAppKitProvider = ({
    children,
    node,
    walletConnectOptions,
    usePersistence = false,
    logLevel,
    requireCertificate,
    themeVariables,
    themeMode,
    i18n,
    language,
    modalParent,
    onSourceClick,
    connectionCertificate: connectionCertificateData,
    allowedWallets,
    v2Api,
    autoInitialize = true,
}: DAppKitProviderOptions): React.ReactElement | null => {
    const [dAppKit, setDAppKit] = useState<DAppKit | null>(null);
    const [_initialized, setInitialized] = useState(false);
    useEffect(() => {
        const kit = DAppKitUI.configure({
            node,
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
            allowedWallets,
            v2Api,
        });
        setDAppKit(kit);
        if (v2Api.enabled && autoInitialize)
            kit.initialize()
                .then(() => {
                    DAppKitLogger.debug(
                        'DAppKitProvider',
                        'v2 initialize',
                        'initialized',
                    );
                    setInitialized(true);
                })
                .catch((e) => {
                    DAppKitLogger.error('DAppKitProvider', 'v2 initialize', e);
                });
    }, [
        node,
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
        allowedWallets,
        v2Api.enabled,
        autoInitialize,
    ]);

    const initialized = useMemo(
        () => (v2Api.enabled ? _initialized : true),
        [_initialized],
    );

    if (!dAppKit) {
        return null;
    }
    return (
        <DAppKitProviderData dAppKit={dAppKit} initialized={initialized}>
            {children}
        </DAppKitProviderData>
    );
};
