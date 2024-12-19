'use client';

import { usePrivy } from '@privy-io/react-auth';
import {
    useWallet as useDappKitWallet,
    useVechainDomain,
} from '@vechain/dapp-kit-react';
import { useSmartAccount } from './useSmartAccount';

type UseWalletReturnType = {
    isConnected: boolean;
    isConnectedWithPrivy: boolean;
    isConnectedWithDappKit: boolean;
    isLoadingConnection: boolean;
    isCrossAppPrivyAccount: boolean;
    connectionType: 'privy' | 'wallet' | 'privy-cross-app';
    connectedAccount: string | undefined;
    selectedAddress: string | undefined;
    crossAppAccount: string | undefined;
    privyEmbeddedWallet: string | undefined;
    dappKitAccount: string | undefined | null;
    smartAccount: {
        address: string | undefined;
        isDeployed: boolean;
        ownerAddress: string | undefined;
    };
    logoutAndDisconnect: () => Promise<void>;
    vetDomain: string | undefined;
    privyUser: any;
};

export const useWallet = (): UseWalletReturnType => {
    const { user, authenticated, logout, ready } = usePrivy();

    const { account: dappKitAccount, disconnect: dappKitDisconnect } =
        useDappKitWallet();

    const smartAccount = useSmartAccount();

    const isConnectedWithDappKit = !!dappKitAccount;
    const isConnectedWithPrivy = authenticated && !!user;
    const isConnected = isConnectedWithDappKit || isConnectedWithPrivy;

    const isCrossAppPrivyAccount = Boolean(
        user?.linkedAccounts?.some((account) => account.type === 'cross_app'),
    );

    const connectionType = isCrossAppPrivyAccount
        ? 'privy-cross-app'
        : isConnectedWithDappKit
        ? 'wallet'
        : 'privy';

    const crossAppAccount = user?.linkedAccounts.find(
        (account) => account.type === 'cross_app',
    );

    const privyEmbeddedWallet = user?.wallet?.address;

    // The connectedAccount can be either:
    // 1. The dappKit connected account
    // 2. The owner of the smart account (either crossAppAccount or privyEmbeddedWallet)
    const connectedAccount = isConnectedWithDappKit
        ? dappKitAccount
        : smartAccount.ownerAddress;

    const selectedAddress = isConnectedWithDappKit
        ? dappKitAccount
        : smartAccount.address;

    const selectedAddressVetDomain = useVechainDomain({
        addressOrDomain: selectedAddress,
    });

    const logoutAndDisconnect = async () => {
        if (isConnectedWithDappKit) {
            dappKitDisconnect();
        } else {
            logout();
        }
    };

    const isLoadingConnection = !ready;

    return {
        isConnected,
        isConnectedWithPrivy,
        isConnectedWithDappKit,
        isLoadingConnection,
        isCrossAppPrivyAccount,
        connectionType,

        connectedAccount,
        selectedAddress,
        dappKitAccount,
        crossAppAccount: crossAppAccount?.embeddedWallets?.[0]?.address,
        privyEmbeddedWallet,
        smartAccount,

        logoutAndDisconnect,
        vetDomain: selectedAddressVetDomain.domain,
        privyUser: user,
    };
};
