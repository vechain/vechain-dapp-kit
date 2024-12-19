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
    crossAppAccount: string | undefined;
    privyEmbeddedWallet: string | undefined;
    smartAccount: {
        address: string | undefined;
        isDeployed: boolean;
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

    const connectedAccount =
        dappKitAccount ??
        crossAppAccount?.embeddedWallets?.[0]?.address ??
        privyEmbeddedWallet;

    const vetDomain = useVechainDomain({ addressOrDomain: dappKitAccount });

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
        connectionType,
        isLoadingConnection,
        isCrossAppPrivyAccount,
        connectedAccount,
        crossAppAccount: crossAppAccount?.embeddedWallets?.[0]?.address,
        privyEmbeddedWallet,
        smartAccount,
        logoutAndDisconnect,
        vetDomain: vetDomain.domain,
        privyUser: user,
    };
};
