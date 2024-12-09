'use client';

import { usePrivy } from '@privy-io/react-auth';
import {
    useWallet as useDappKitWallet,
    useVechainDomain,
    useConnex,
    useWalletModal,
} from '@vechain/dapp-kit-react';
import { useSmartAccount } from './useSmartAccount';

export const useWallet = (): {
    isConnected: boolean;
    isConnectedWithPrivy: boolean;
    isConnectedWithDappKit: boolean;
    connectedAddress: string | undefined;
    smartAccount: {
        address: string | undefined;
        isDeployed: boolean;
    };
    logoutAndDisconnect: () => Promise<void>;
    vetDomain: string | undefined;
    usePrivy: typeof usePrivy;
    useConnex: typeof useConnex;
    useDappKitWalletModal: typeof useWalletModal;
} => {
    const { user, authenticated, logout } = usePrivy();

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
        connectedAddress,
        smartAccount: {
            address: abstractedAccount.address,
            isDeployed: abstractedAccount.isDeployed,
        },
        logoutAndDisconnect,
        vetDomain: vetDomain.domain,
        usePrivy: usePrivy,
        useConnex: useConnex,
        useDappKitWalletModal: useWalletModal,
    };
};
