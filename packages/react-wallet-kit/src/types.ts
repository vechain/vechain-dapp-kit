import type { Options } from "@vechain/connex";
import type React from "react";
import type { WalletConnectOptions } from "@vechain/wallet-connect";
import type { WalletSource } from "@vechain/wallet-kit";

export interface AccountState {
  address: string | null;
  source: WalletSource | null;
}

/**
 * Set the wallet account
 * @param account - account address
 */
export type SetAccount = (account: string) => void;

/**
 * Set the wallet source
 * @param wallet - wallet source
 */
export type SetSource = (wallet: WalletSource) => void;

/**
 * Connex Provider Options
 * @param children - React children
 * @param nodeOptions - Connex node options
 * @param walletConnectOptions - WalletConnect options
 * @param persistState - An option to persist state. Defaults to false
 */
export interface ConnexProviderOptions {
  children: React.ReactNode;
  nodeOptions: Omit<Options, "signer">;
  walletConnectOptions?: WalletConnectOptions;
  persistState?: boolean;
}

/**
 * Connex Context
 * This context is used to provide the Connex instance and the Connex Vendor instance
 * to the application.
 *
 * @param thor - {@link Connex.Thor}: used to interact with the blockchain
 * @param vendor - {@link Connex.Vendor}: used to interact with the wallet
 * @param setWallet - used to set the wallet source
 * @param availableWallets - list of available wallets
 * @param accountState - current account state
 * @param dispatch - used to dispatch account actions
 */

export interface ConnexContext {
  connex: Connex;
  wallet: {
    setSource: SetSource;
    setAccount: SetAccount;
    availableWallets: WalletSource[];
    wallets: WalletSource[];
    accountState: AccountState;
    disconnect: () => void;
  };
}
