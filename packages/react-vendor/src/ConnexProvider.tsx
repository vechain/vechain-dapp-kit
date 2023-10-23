import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import { Connex } from "@vechain/connex";
import { newVendor } from "@vechain/connex-framework";
import type { WalletConnectOptions, WCSigner } from "wallet-connect/dist";
import { newWcClient, newWcSigner, newWeb3Modal } from "wallet-connect/dist";
import { accountReducer, defaultAccountState } from "./AccountReducer";
import type { ConnexContext, ConnexProviderOptions, SetAccount, SetSource } from "./types";
import { WalletSource } from "./types";

/**
 * Context
 */
const Context = createContext<ConnexContext>({} as ConnexContext);

export const ConnexProvider: React.FC<ConnexProviderOptions> = ({
  children,
  nodeOptions,
  walletConnectOptions,
  persistState = false,
}): React.ReactElement => {
  const [accountState, dispatch] = useReducer(
    accountReducer,
    defaultAccountState
  );

  const wcSignerRef = useRef<WCSigner | undefined>();

  const disconnectMobile = useCallback(() => {
    const client = wcSignerRef.current;

    if (client) {
      client.disconnect().catch((err) => {
        throw err;
      });
      wcSignerRef.current = undefined;
    }
  }, []);

  const availableWallets = useMemo(() => {
    const wallets: WalletSource[] = [WalletSource.Sync2];

    if (window.vechain) {
      wallets.push(WalletSource.VeWorldExtension);
    }

    if (window.connex) {
      wallets.push(WalletSource.Sync);
    }

    if (walletConnectOptions) {
      wallets.push(WalletSource.WalletConnect);
    }

    return wallets;
  }, [walletConnectOptions]);

  const onDisconnected = useCallback((): void => {
    if (accountState.source === WalletSource.WalletConnect) {
      disconnectMobile();
    }

    dispatch({ type: "clear" });
  }, [disconnectMobile, accountState]);

  useEffect(() => {
    if (
      accountState.source === WalletSource.WalletConnect &&
      !walletConnectOptions
    ) {
      onDisconnected();
    }

    if (
      accountState.source === WalletSource.VeWorldExtension &&
      !window.vechain
    ) {
      onDisconnected();
    }
  }, [accountState, walletConnectOptions, onDisconnected]);

  const updateSource: SetSource = useCallback(
    (wallet: WalletSource): void => {
      // We can't set VeWorld Mobile if there is no Wallet Connect config
      if (wallet === WalletSource.WalletConnect && !walletConnectOptions) {
        throw new Error("Wallet Connect config not found");
      }

      // We can't set VeWorld Extension if there is no VeChain extension
      if (wallet === WalletSource.VeWorldExtension && !window.vechain) {
        throw new Error("VeWorld extension not found");
      }

      dispatch({
        type: "set-wallet-source",
        payload: { source: wallet, persist: persistState },
      });
    },
    [walletConnectOptions, persistState]
  );

  const thor: Connex.Thor = useMemo(
    () => new Connex.Thor(nodeOptions),
    [nodeOptions]
  );

  const createWalletConnectVendor = useCallback(
    (options: WalletConnectOptions) => {
      const { projectId, metadata } = options;

      const wcClient = newWcClient({
        projectId,
        metadata,
      });

      const web3Modal = newWeb3Modal(projectId);

      const wcSigner: WCSigner = newWcSigner({
        genesisId: thor.genesis.id,
        wcClient,
        web3Modal,
        onDisconnected,
      });

      wcSignerRef.current = wcSigner;

      return newVendor(wcSigner);
    },
    [onDisconnected, thor.genesis.id]
  );

  /**
   * Create the vendor
   * Create a vendor for the provided options. If that vendor is not available, the priority is:
   * 1. Wallet Connect - If the options are provided
   * 2. VeWorld Extension - If the extension is available
   * 3. Sync2 - As a fallback, as it is always available
   */
  const vendor: Connex.Vendor = useMemo(() => {
    const { source } = accountState;

    if (source === WalletSource.WalletConnect && walletConnectOptions) {
      return createWalletConnectVendor(walletConnectOptions);
    }

    if (source === WalletSource.Sync2 || source === WalletSource.Sync) {
      return new Connex.Vendor(thor.genesis.id, source);
    }

    if (source === WalletSource.VeWorldExtension && window.vechain) {
      const extensionSigner: Connex.Signer = window.vechain.newConnexSigner(
        thor.genesis.id
      );

      return newVendor(extensionSigner);
    }

    // We've exhausted all options, so default to Wallet Connect if the options are provided
    if (walletConnectOptions) {
      return createWalletConnectVendor(walletConnectOptions);
    }

    // No wallet connect options, so use the extension if it's available
    if (window.vechain) {
      const extensionSigner: Connex.Signer = window.vechain.newConnexSigner(
        thor.genesis.id
      );

      return newVendor(extensionSigner);
    }

    // Default to Sync2
    return new Connex.Vendor(thor.genesis.id, WalletSource.Sync2);
  }, [
    createWalletConnectVendor,
    thor.genesis.id,
    walletConnectOptions,
    accountState,
  ]);

  const updateAccount: SetAccount = useCallback(
    (address: string) => {
      dispatch({
        type: "set-address",
        payload: { address, persist: persistState },
      });
    },
    [persistState]
  );

  const wallets: WalletSource[] = useMemo(() => {
    return Object.values(WalletSource);
  }, []);

  const context: ConnexContext = useMemo(() => {
    return {
      connex: {
        thor,
        vendor,
      },
      wallet: {
        setSource: updateSource,
        setAccount: updateAccount,
        availableWallets,
        wallets,
        accountState,
        disconnect: onDisconnected,
      },
    };
  }, [
    onDisconnected,
    updateAccount,
    accountState,
    thor,
    vendor,
    updateSource,
    wallets,
    availableWallets,
  ]);

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useConnex = (): Connex => {
  const context = useContext(Context);
  return context.connex;
};

export const useWallet = (): ConnexContext["wallet"] => {
  const context = useContext(Context);
  return context.wallet;
};
