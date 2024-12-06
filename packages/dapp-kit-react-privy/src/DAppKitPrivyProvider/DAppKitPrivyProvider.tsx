import { ReactNode } from 'react';
import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth';
import { DAppKitProvider } from '@vechain/dapp-kit-react';
import { SmartAccountProvider } from './hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type Props = {
    children: ReactNode;
    privyConfig: {
        appId: string;
        clientId: string;
        appearance: {
            theme: 'dark' | 'light';
            accentColor: `#${string}`;
            loginMessage: string;
            logo: string;
        };
        embeddedWallets?: {
            createOnLogin: 'users-without-wallets' | 'all-users' | 'off';
        };
        loginMethods: (
            | 'wallet'
            | 'email'
            | 'sms'
            | 'google'
            | 'twitter'
            | 'discord'
            | 'github'
            | 'linkedin'
            | 'spotify'
            | 'instagram'
            | 'tiktok'
            | 'apple'
            | 'farcaster'
            | 'telegram'
        )[];
    };
    smartAccountConfig: {
        nodeUrl: string;
        delegatorUrl: string;
        accountFactoryAddress: string;
    };
    dappKitConfig: {
        nodeUrl: string;
        genesis: Connex.Thor.Block;
        projectId: string;
        colorMode: 'DARK' | 'LIGHT';
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

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 0,
            staleTime: 30000,
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchInterval: false,
            refetchIntervalInBackground: false,
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
        },
    },
});

export const DAppKitPrivyProvider = ({
    children,
    privyConfig,
    smartAccountConfig,
    dappKitConfig,
}: Props) => {
    return (
        <QueryClientProvider client={queryClient}>
            <BasePrivyProvider
                appId={privyConfig.appId}
                clientId={privyConfig.clientId}
                config={{
                    loginMethods: privyConfig.loginMethods,
                    appearance: privyConfig.appearance,
                    embeddedWallets: {
                        createOnLogin:
                            privyConfig.embeddedWallets?.createOnLogin ??
                            'all-users',
                    },
                }}
            >
                <SmartAccountProvider
                    nodeUrl={smartAccountConfig.nodeUrl}
                    delegatorUrl={smartAccountConfig.delegatorUrl}
                    accountFactory={smartAccountConfig.accountFactoryAddress}
                >
                    <DAppKitProvider
                        nodeUrl={dappKitConfig.nodeUrl}
                        genesis={dappKitConfig.genesis}
                        usePersistence
                        walletConnectOptions={
                            dappKitConfig.walletConnectOptions
                        }
                        themeMode={dappKitConfig.colorMode}
                        themeVariables={{}}
                    >
                        {children}
                    </DAppKitProvider>
                </SmartAccountProvider>
            </BasePrivyProvider>
        </QueryClientProvider>
    );
};
