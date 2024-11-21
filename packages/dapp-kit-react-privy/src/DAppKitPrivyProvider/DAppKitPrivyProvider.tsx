import { PrivyProvider as BasePrivyProvider } from "@privy-io/react-auth";

export const DAppKitPrivyProvider = ({}) => {
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
        <DAppKitProvider>
            {children}
        </DAppKitProvider>
      </BasePrivyProvider>
    );
};