import { LazyDriver } from "@vechain/connex/esm/driver";
import type { WalletSource } from "./wallet";

const _cachedDrivers: Record<string, LazyDriver | undefined> = {};

const createVendorDriver = (
  signer: Promise<Connex.Signer>,
  source: WalletSource
): LazyDriver => {
  const cachedDriver = _cachedDrivers[source];

  if (cachedDriver) {
    return cachedDriver;
  }

  const driver = new LazyDriver(signer);
  _cachedDrivers[source] = driver;

  return driver;
};

export { createVendorDriver };
