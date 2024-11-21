import { ReactNode } from "react";
import { PrivyProvider as BasePrivyProvider } from "@privy-io/react-auth";
import { DAppKitProvider } from "@vechain/dapp-kit-react";

type Props = {
  children: ReactNode;
  appId: string;
  clientId: string;
  appearance: {
    theme: "dark" | "light";
    accentColor: `#${string}`;
    loginMessage: string;
    logo: string;
  };
  embeddedWallets: {
    createOnLogin: "all-users";
  };
  loginMethods: (
    | "wallet"
    | "email"
    | "sms"
    | "google"
    | "twitter"
    | "discord"
    | "github"
    | "linkedin"
    | "spotify"
    | "instagram"
    | "tiktok"
    | "apple"
    | "farcaster"
    | "telegram"
  )[];
  smartAccountConfig: {
    nodeUrl: string;
    delegatorUrl: string;
    accountFactoryAddress: string;
  };
  dappKitConfig: {
    nodeUrl: string;
    genesis: Connex.Thor.Block;
    projectId: string;
    colorMode: "DARK" | "LIGHT";
    walletConnectOptions: {
      projectId: string;
      metadata: {
        name: string;
        description: string;
        url: string;
        icons: string[];
      };
    };
  };
};

export const DAppKitPrivyProvider = ({
  children,
  appId,
  clientId,
  loginMethods,
  appearance,
  embeddedWallets,
  dappKitConfig
}: Props) => {
    return (
      <BasePrivyProvider  
        appId={appId}
        clientId={clientId}
        config={{
          loginMethods: loginMethods,
          appearance: appearance,
          embeddedWallets: {
            createOnLogin: embeddedWallets.createOnLogin,
          },
        }}
      >
        <DAppKitProvider
          nodeUrl={dappKitConfig.nodeUrl}
          genesis={dappKitConfig.genesis}
          usePersistence
          walletConnectOptions={dappKitConfig.walletConnectOptions}
          themeMode={dappKitConfig.colorMode}
          themeVariables={{}}>
          {children}
        </DAppKitProvider>
      </BasePrivyProvider>
    );
};