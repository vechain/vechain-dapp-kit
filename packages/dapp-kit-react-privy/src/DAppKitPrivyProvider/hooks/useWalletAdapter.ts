"use client";

import { humanAddress } from "../utils";
import { usePrivy } from "@privy-io/react-auth";
import { useWallet/*, useWalletModal*/ } from "@vechain/dapp-kit-react";
import { useMemo } from "react";
import { useSmartAccount } from "./useSmartAccount";
// import { useSelectedUserStore } from "@/store";
//import { useWalletName } from "@vechain.energy/dapp-kit-hooks";

// Hook we use to understand if user connected with Privy or DappKit.
export const useWalletAdapter = () => {
  const {
    user,
    authenticated,
    exportWallet,
    logout,
    linkGoogle,
    linkTwitter,
    ready,
    unlinkGoogle,
    unlinkTwitter,
  } = usePrivy();

  const { account, disconnect } = useWallet();
  //const { name: vetDomain } = useWalletName(account);
  const vetDomain = "VeChain";
  // const { setUser } = useSelectedUserStore();
  const abstractedAccount = useSmartAccount();

  // const dappKitModal = useWalletModal();

  const isConenctedWithDappKit = !!account;
  const isConnectedWithPrivy = authenticated && !!user;
  const isConnected = isConenctedWithDappKit || isConnectedWithPrivy;

  // a wallet is in this array if it is connected to Privy
  const amountOfSocialsConnectedToPrivy =
    (user?.linkedAccounts?.length || 1) - 1;

  const connectedAddress = account ?? abstractedAccount.address;

  const username = useMemo(() => {
    return (
      user?.google?.name ||
      user?.twitter?.name ||
      vetDomain ||
      humanAddress(account || "")
    );
  }, [user, account, vetDomain]);

  const logoutAndDisconnect = async () => {
    // setUser(undefined);

    if (isConenctedWithDappKit) {
      disconnect();
    } else {
      logout();
    }
  };

  return {
    isConnected,
    isConnectedWithPrivy,
    isConenctedWithDappKit,
    username,
    connectedAddress, // This is the connected address.
    abstractedAccount,
    privyUser: user,
    isPrivyLoading: !ready,
    exportPrivyWallet: exportWallet,
    logout: logoutAndDisconnect,
    linkGoogle,
    linkTwitter,
    unlinkGoogle,
    unlinkTwitter,
    amountOfSocialsConnectedToPrivy,
    vetDomain,
  };
};
