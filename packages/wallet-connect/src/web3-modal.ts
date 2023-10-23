import { WalletConnectModal } from "@walletconnect/modal";

const _cachedModals: Record<string, WalletConnectModal | undefined> = {};

/**
 * Creates a new WalletConnectModal instance
 * @param projectId - Your WalletConnect project ID
 */
export const newWeb3Modal = (projectId: string): WalletConnectModal => {
  const cached = _cachedModals[projectId];

  if (cached) {
    return cached;
  }

  const modal = new WalletConnectModal({
    projectId,
    explorerRecommendedWalletIds: "NONE",
    mobileWallets: [
      {
        name: "VeWorld",
        id: "veworld-mobile",
        links: {
          native: "veworld://org.vechain.veworld.app/",
          universal: "https://veworld.com",
        },
      },
    ],
    themeVariables: {
      "--wcm-z-index": "99999999",
    },
    walletImages: {
      "veworld-mobile": "https://www.veworld.net/assets/logo/logo.svg",
    },
  });

  _cachedModals[projectId] = modal;

  return modal;
};
