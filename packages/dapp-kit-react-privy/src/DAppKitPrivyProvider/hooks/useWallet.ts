'use client';

import { usePrivy, User } from '@privy-io/react-auth';
import { useWallet as useDappKitWallet } from '@vechain/dapp-kit-react';
import { useSmartAccount } from './useSmartAccount';
import { useCachedVechainDomain } from './useCachedVechainDomain';

export type UseWalletReturnType = {
    // When user connects with a wallet
    wallet: {
        address: string;
        domain: string;
    };

    // Every user connected with privy has one
    smartAccount: {
        address: string;
        domain: string;
        isDeployed: boolean;
        owner: string;
    };

    // wallet created by the social login provider
    embeddedWallet: {
        address: string;
        domain: string;
    };

    // Wallet of the user connected with a cross app provider
    crossAppAccount: {
        address: string;
        domain: string;
    };

    // Privy user if user is connected with privy
    privyUser: User | null;

    // Connection status
    connection: {
        isConnected: boolean;
        isConnectedWithPrivy: boolean;
        isConnectedWithDappKit: boolean;
        isConnectedWithCrossAppPrivy: boolean;
        isLoadingPrivyConnection: boolean;
        type: 'privy' | 'wallet' | 'privy-cross-app';
        selectedAccount: string;
        connectedAccount: string;
    };

    // Disconnect function
    disconnect: () => Promise<void>;
};

export const useWallet = (): UseWalletReturnType => {
    const { user, authenticated, logout, ready } = usePrivy();
    const { account: dappKitAccount, disconnect: dappKitDisconnect } =
        useDappKitWallet();
    const smartAccount = useSmartAccount();

    // Connection states
    const isConnectedWithDappKit = !!dappKitAccount;
    const isConnectedWithPrivy = authenticated && !!user;
    const isConnected = isConnectedWithDappKit || isConnectedWithPrivy;
    const isCrossAppPrivyAccount = Boolean(
        user?.linkedAccounts?.some((account) => account.type === 'cross_app'),
    );

    // Connection type
    const connectionType = isCrossAppPrivyAccount
        ? 'privy-cross-app'
        : isConnectedWithDappKit
        ? 'wallet'
        : 'privy';

    // Get cross app account
    const crossAppAccount = user?.linkedAccounts.find(
        (account) => account.type === 'cross_app',
    );

    // Get embedded wallet
    const privyEmbeddedWallet = user?.wallet?.address;

    // Get connected and selected accounts
    const connectedAccount = isConnectedWithDappKit
        ? dappKitAccount
        : smartAccount.owner;

    const selectedAddress = isConnectedWithDappKit
        ? dappKitAccount
        : smartAccount.address;

    // Use cached domain lookups for each address
    const walletDomain = useCachedVechainDomain(dappKitAccount ?? '')
        .domainResult.domain;
    const smartAccountDomain = useCachedVechainDomain(
        smartAccount.address ?? '',
    ).domainResult.domain;
    const embeddedWalletDomain = useCachedVechainDomain(
        privyEmbeddedWallet ?? '',
    ).domainResult.domain;
    const crossAppAccountDomain = useCachedVechainDomain(
        crossAppAccount?.embeddedWallets?.[0]?.address ?? '',
    ).domainResult.domain;

    // Disconnect function
    const disconnect = async () => {
        if (isConnectedWithDappKit) {
            dappKitDisconnect();
        } else {
            logout();
        }
    };

    return {
        wallet: {
            address: dappKitAccount ?? '',
            domain: walletDomain ?? '',
        },
        smartAccount: {
            address: smartAccount.address ?? '',
            domain: smartAccountDomain ?? '',
            isDeployed: smartAccount.isDeployed,
            owner: smartAccount.owner ?? '',
        },
        embeddedWallet: {
            address: privyEmbeddedWallet ?? '',
            domain: embeddedWalletDomain ?? '',
        },
        crossAppAccount: {
            address: crossAppAccount?.embeddedWallets?.[0]?.address ?? '',
            domain: crossAppAccountDomain ?? '',
        },
        privyUser: user,
        connection: {
            isConnected,
            isConnectedWithPrivy,
            isConnectedWithDappKit,
            isConnectedWithCrossAppPrivy: isCrossAppPrivyAccount,
            isLoadingPrivyConnection: !ready,
            type: connectionType,
            selectedAccount: selectedAddress ?? '',
            connectedAccount: connectedAccount ?? '',
        },
        disconnect,
    };
};
