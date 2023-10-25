/**
 * Wallet types
 */

enum WalletSource {
  WalletConnect = "wallet-connect",
  VeWorldExtension = "veworld-extension",
  Sync2 = "sync2",
  Sync = "sync",
}

interface WalletConfig {
  requiresCertificate: boolean;
}

const DEFAULT_CONFIG: WalletConfig = {
  requiresCertificate: true,
};

const WalletMapping: Record<WalletSource, WalletConfig> = {
  [WalletSource.WalletConnect]: {
    requiresCertificate: false,
  },
  [WalletSource.VeWorldExtension]: DEFAULT_CONFIG,
  [WalletSource.Sync2]: DEFAULT_CONFIG,
  [WalletSource.Sync]: DEFAULT_CONFIG,
};

export { WalletSource, WalletMapping };

export type { WalletConfig };
