import { createContext, ReactNode, useContext } from 'react';
import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth';
import { DAppKitProvider, DAppKitUIOptions } from '@vechain/dapp-kit-react';
import { SmartAccountProvider } from './hooks';

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
        ecosystemAppsID?: string[];
    };
    smartAccountConfig?: {
        nodeUrl: string;
        delegatorUrl: string;
        accountFactoryAddress: string;
    };
    dappKitConfig: DAppKitUIOptions;
};

type DAppKitPrivyConfig = {
    privyConfig: Props['privyConfig'];
    smartAccountConfig?: Props['smartAccountConfig'];
    dappKitConfig: Props['dappKitConfig'];
};

/**
 * Context to store the Privy and DAppKit configs so that they can be used by the hooks/components
 */
export const DAppKitPrivyContext = createContext<DAppKitPrivyConfig | null>(
    null,
);

/**
 * Hook to get the Privy and DAppKit configs
 */
export const useDAppKitPrivyConfig = () => {
    const context = useContext(DAppKitPrivyContext);
    if (!context) {
        throw new Error(
            'useDAppKitPrivyConfig must be used within DAppKitPrivyProvider',
        );
    }
    return context;
};

/**
 * Provider to wrap the application with Privy and DAppKit
 */
export const DAppKitPrivyProvider = ({
    children,
    privyConfig,
    smartAccountConfig,
    dappKitConfig,
}: Props) => {
    // Join login methods and ecosystemAppsID, but ecosystemAppsID needs to be written as "privy:appID"
    const loginMethods = [
        ...privyConfig.loginMethods,
        ...(privyConfig.ecosystemAppsID ?? []).map((appID) => `privy:${appID}`),
    ];

    return (
        <DAppKitPrivyContext.Provider
            value={{ privyConfig, smartAccountConfig, dappKitConfig }}
        >
            <BasePrivyProvider
                appId={privyConfig.appId}
                clientId={privyConfig.clientId}
                config={{
                    loginMethodsAndOrder: {
                        // @ts-ignore
                        primary: loginMethods,
                    },
                    // loginMethods: privyConfig.loginMethods,
                    appearance: privyConfig.appearance,
                    embeddedWallets: {
                        createOnLogin:
                            privyConfig.embeddedWallets?.createOnLogin ??
                            'all-users',
                    },
                }}
            >
                <SmartAccountProvider
                    nodeUrl={smartAccountConfig?.nodeUrl ?? ''}
                    delegatorUrl={smartAccountConfig?.delegatorUrl ?? ''}
                    accountFactory={
                        smartAccountConfig?.accountFactoryAddress ?? ''
                    }
                >
                    <DAppKitProvider
                        nodeUrl={dappKitConfig.nodeUrl}
                        genesis={dappKitConfig.genesis}
                        usePersistence
                        walletConnectOptions={
                            dappKitConfig.walletConnectOptions
                        }
                        themeMode={dappKitConfig.themeMode}
                        themeVariables={{}}
                    >
                        {children}
                    </DAppKitProvider>
                </SmartAccountProvider>
            </BasePrivyProvider>
        </DAppKitPrivyContext.Provider>
    );
};
