'use client';

import { usePrivy, User } from '@privy-io/react-auth';
import { useWallet as useDappKitWallet } from '@vechain/dapp-kit-react';
import { useSmartAccount } from './useSmartAccount';
import { useCachedVeChainDomain } from './useCachedVechainDomain';
import { getPicassoImage } from '../utils';

export type Wallet = {
    address: string;
    domain: string | undefined;
    image: string;
};

export type SmartAccount = Wallet & {
    isDeployed: boolean;
    owner: string;
};

export type ConnectionSource = {
    type: 'privy' | 'wallet' | 'privy-cross-app';
    displayName: string;
};

export type UseWalletReturnType = {
    // When user connects with a wallet
    wallet: Wallet;

    // wallet created by the social login provider
    embeddedWallet: Wallet;

    // Wallet of the user connected with a cross app provider
    crossAppWallet: Wallet;

    // Every user connected with privy has one
    smartAccount: SmartAccount;

    // Currently is always the smart account if connected with privy
    selectedAccount: Wallet;
    // Privy wallet or veworld wallet
    connectedWallet: Wallet;

    // Privy user if user is connected with privy
    privyUser: User | null;

    // Connection status
    connection: {
        isConnected: boolean;
        isConnectedWithPrivy: boolean;
        isConnectedWithDappKit: boolean;
        isConnectedWithCrossAppPrivy: boolean;
        isLoadingPrivyConnection: boolean;
        source: ConnectionSource;
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
    const connectionSource: ConnectionSource = isCrossAppPrivyAccount
        ? {
              type: 'privy-cross-app',
              displayName: 'App',
          }
        : isConnectedWithDappKit
        ? {
              type: 'wallet',
              displayName: 'Wallet',
          }
        : {
              type: 'privy',
              displayName: 'Social',
          };

    // Get cross app account
    const crossAppAccount = user?.linkedAccounts.find(
        (account) => account.type === 'cross_app',
    );

    // Get embedded wallet
    const privyEmbeddedWallet = user?.wallet?.address;

    // Get connected and selected accounts
    const connectedWalletAddress = isConnectedWithDappKit
        ? dappKitAccount
        : smartAccount.owner;

    const selectedAddress = isConnectedWithDappKit
        ? dappKitAccount
        : smartAccount.address;

    // Use cached domain lookups for each address
    const walletDomain = useCachedVeChainDomain(dappKitAccount ?? '')
        .domainResult.domain;
    const smartAccountDomain = useCachedVeChainDomain(
        smartAccount.address ?? '',
    ).domainResult.domain;
    const embeddedWalletDomain = useCachedVeChainDomain(
        privyEmbeddedWallet ?? '',
    ).domainResult.domain;
    const crossAppAccountDomain = useCachedVeChainDomain(
        crossAppAccount?.embeddedWallets?.[0]?.address ?? '',
    ).domainResult.domain;

    const selectedAccount = {
        address: selectedAddress ?? '',
        domain: useCachedVeChainDomain(selectedAddress ?? '').domainResult
            .domain,
        image: getPicassoImage(selectedAddress ?? ''),
    };

    const connectedWallet = {
        address: connectedWalletAddress ?? '',
        domain: useCachedVeChainDomain(connectedWalletAddress ?? '')
            .domainResult.domain,
        image: getPicassoImage(connectedWalletAddress ?? ''),
    };

    // Disconnect function
    const disconnect = async () => {
        if (isConnectedWithDappKit) {
            dappKitDisconnect();
        } else {
            await logout();
        }
    };

    return {
        wallet: {
            address: dappKitAccount ?? '',
            domain: walletDomain ?? '',
            image: getPicassoImage(selectedAccount.address),
        },
        smartAccount: {
            address: smartAccount.address ?? '',
            domain: smartAccountDomain ?? '',
            image: getPicassoImage(selectedAccount.address),
            isDeployed: smartAccount.isDeployed,
            owner: smartAccount.owner ?? '',
        },
        embeddedWallet: {
            address: privyEmbeddedWallet ?? '',
            domain: embeddedWalletDomain ?? '',
            image: getPicassoImage(selectedAccount.address),
        },
        crossAppWallet: {
            address: crossAppAccount?.embeddedWallets?.[0]?.address ?? '',
            domain: crossAppAccountDomain ?? '',
            image: getPicassoImage(selectedAccount.address),
        },
        selectedAccount,
        connectedWallet,
        privyUser: user,
        connection: {
            isConnected,
            isConnectedWithPrivy,
            isConnectedWithDappKit,
            isConnectedWithCrossAppPrivy: isCrossAppPrivyAccount,
            isLoadingPrivyConnection: !ready,
            source: connectionSource,
        },
        disconnect,
    };
};
