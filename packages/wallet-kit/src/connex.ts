import { Framework } from "@vechain/connex-framework";
import type { WalletConnectOptions } from "@vechain/wallet-connect";
import type { Genesis } from "./types";
import { WalletSource } from "./wallet";
import { createSigner } from "./signer";
import { normalizeGenesisBlock } from "./genesis";
import { createVendorDriver } from "./vendor-driver";
import { createDriverNoVendor } from "./thor-driver";

interface BaseConnexOptions {
  nodeUrl: string;
  genesis: Genesis;
}

interface NoWalletConfigOptions extends BaseConnexOptions {
  source:
    | WalletSource.VeWorldExtension
    | WalletSource.Sync
    | WalletSource.Sync2;
}

interface WalletConnectConfigOptions extends BaseConnexOptions {
  source: WalletSource.WalletConnect;
  options: WalletConnectOptions;
  onDisconnected: () => void;
}

type ConnexOptions = NoWalletConfigOptions | WalletConnectConfigOptions;

const createConnexInstance = (options: ConnexOptions): Connex => {
  const { source, genesis } = options;

  const genesisBlock = normalizeGenesisBlock(genesis);

  let signer: Promise<Connex.Signer>;

  if (source === WalletSource.WalletConnect) {
    signer = createSigner({
      source: options.source,
      genesis: options.genesis,
      options: options.options,
      onDisconnected: options.onDisconnected,
    });
  } else {
    signer = createSigner({
      source: options.source,
      genesis: options.genesis,
    });
  }

  // This is cached, so the `DriverNoVendor` is shared between wallet sources
  const driverNoVendor = createDriverNoVendor(options.nodeUrl, genesisBlock);

  // This is also cached based on the source
  const vendorDriver = createVendorDriver(signer, source);

  vendorDriver.setNoVendor(driverNoVendor);

  const framework = new Framework(vendorDriver);

  return {
    thor: framework.thor,
    vendor: framework.vendor,
  };
};

export { createConnexInstance };
