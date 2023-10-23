import type { WalletConnectModal } from "@walletconnect/modal";
import type { SignClientTypes } from "@walletconnect/types";
import type { SignClient } from "@walletconnect/sign-client";

export type ResolvedSignClient = Awaited<ReturnType<typeof SignClient.init>>;

/**
 * WCSigner is a {@link Connex.Signer} with an additional disconnect method
 *
 */
export type WCSigner = Connex.Signer & {
  /**
   * Disconnects and cleans up the WalletConnect session
   */
  disconnect: () => Promise<void>;

  /**
   * The genesis ID of the current signer
   */
  genesisId: string;
};

export interface WCClient {
  /**
   * Gets the initialized WalletConnect SignClient
   */
  get: () => Promise<ResolvedSignClient>;
}

/**
 * Options for the newWcClient function
 * @param projectId - Your WalletConnect project ID
 * @param relayUrl - The URL of your WalletConnect relay server
 * @param metadata - The metadata of your WalletConnect dApp
 * @param logger - The logger or log level to use
 */
export interface WalletConnectOptions {
  projectId: string;
  metadata: SignClientTypes.Options["metadata"];
}

/**
 * Options for the {@link WCSigner}
 * @param wcClient - A function to get the initialized WalletConnect SignClient
 * @param web3Modal - A WalletConnectModal instance
 * @param onDisconnected - (optional) A callback that will be called when the session is disconnected
 * @param genesisId - The genesis ID of the VeChain network you want to connect to
 */
export interface WCSignerOptions {
  wcClient: WCClient;
  web3Modal: WalletConnectModal;
  onDisconnected?: () => void;
  genesisId: string;
}
