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

    // TODO: Add the possibility to manually select the account
    // If I am connected with dappKit then the connectedAccount is of dappKit,
    // if I am connected with app then the connected account is the smart account owned
    // by the crossAppAccount, if instead I am connected with social the connected
    // account is the smart account owned by the privyEmbedded wallet
    const connectedAccount = isConnectedWithDappKit
        ? dappKitAccount
        : isCrossAppPrivyAccount
        ? smartAccount.address // Use smart account owned by crossAppAccount
        : smartAccount.address; // Use smart account owned by privyEmbeddedWallet

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
        isLoadingConnection,
        isCrossAppPrivyAccount,
        connectionType,

        connectedAccount,
        dappKitAccount,
        crossAppAccount: crossAppAccount?.embeddedWallets?.[0]?.address,
        privyEmbeddedWallet,
        smartAccount,

        logoutAndDisconnect,
        vetDomain: vetDomain.domain,
        privyUser: user,
    };
};
