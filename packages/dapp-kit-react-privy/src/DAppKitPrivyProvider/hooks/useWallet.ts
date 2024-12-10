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
    connectedAddress: string | undefined;
    smartAccount: {
        address: string | undefined;
        isDeployed: boolean;
    };
    logoutAndDisconnect: () => Promise<void>;
    vetDomain: string | undefined;
};

export const useWallet = (): UseWalletReturnType => {
    const { user, authenticated, logout, ready } = usePrivy();

    const { account: dappKitAccount, disconnect: dappKitDisconnect } =
        useDappKitWallet();

    const abstractedAccount = useSmartAccount();

    const isConnectedWithDappKit = !!dappKitAccount;
    const isConnectedWithPrivy = authenticated && !!user;
    const isConnected = isConnectedWithDappKit || isConnectedWithPrivy;

    const connectedAddress = dappKitAccount ?? user?.wallet?.address;

    const vetDomain = useVechainDomain({ addressOrDomain: dappKitAccount });

    const logoutAndDisconnect = async () => {
        if (isConnectedWithDappKit) {
            dappKitDisconnect();
        } else {
            logout();
        }
    };

    return {
        isConnected,
        isConnectedWithPrivy,
        isConnectedWithDappKit,
        isLoadingConnection: !ready,
        connectedAddress,
        smartAccount: {
            address: abstractedAccount.address,
            isDeployed: abstractedAccount.isDeployed,
        },
        logoutAndDisconnect,
        vetDomain: vetDomain.domain,
    };
};
