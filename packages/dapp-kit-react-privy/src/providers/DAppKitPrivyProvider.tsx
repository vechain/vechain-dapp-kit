import { createContext, ReactNode, useContext } from 'react';
import {
    PrivyProvider as BasePrivyProvider,
    WalletListEntry,
} from '@privy-io/react-auth';
import { DAppKitProvider, DAppKitUIOptions } from '@vechain/dapp-kit-react';
import { SmartAccountProvider } from '../hooks';
import { ChakraProvider } from '@chakra-ui/react';
import { Theme } from '../theme';
import { PrivyLoginMethod } from '../utils';

type Props = {
    children: ReactNode;
    privyConfig: {
        appId: string;
        clientId: string;
        appearance: {
            walletList: WalletListEntry[];
            theme: 'dark' | 'light';
            accentColor: `#${string}`;
            loginMessage: string;
            logo: string;
        };
        embeddedWallets?: {
            createOnLogin: 'users-without-wallets' | 'all-users' | 'off';
        };
        loginMethods: PrivyLoginMethod[];
        ecosystemAppsID?: string[];
        allowPasskeyLinking?: boolean;
    };
    feeDelegationConfig: {
        delegatorUrl: string;
        delegateAllTransactions: boolean;
    };
    dappKitConfig: DAppKitUIOptions;
};

type DAppKitPrivyConfig = {
    privyConfig: Props['privyConfig'];
    feeDelegationConfig: Props['feeDelegationConfig'];
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
    feeDelegationConfig,
    dappKitConfig,
}: Props) => {
    const loginMethods = [
        ...privyConfig.loginMethods,
        ...(privyConfig.ecosystemAppsID ?? []).map((appID) => `privy:${appID}`),
    ];

    // Set the color mode in localStorage to match the Privy theme
    if (
        !localStorage.getItem('chakra-ui-color-mode') ||
        localStorage.getItem('chakra-ui-color-mode') !==
            privyConfig.appearance.theme
    ) {
        localStorage.setItem(
            'chakra-ui-color-mode',
            privyConfig.appearance.theme,
        );
        localStorage.setItem('chakra-ui-color-mode-default', 'set');
    }

    return (
        <DAppKitPrivyContext.Provider
            value={{ privyConfig, feeDelegationConfig, dappKitConfig }}
        >
            <ChakraProvider theme={Theme}>
                <BasePrivyProvider
                    appId={privyConfig.appId}
                    clientId={privyConfig.clientId}
                    config={{
                        loginMethodsAndOrder: {
                            // @ts-ignore
                            primary: loginMethods,
                        },
                        appearance: privyConfig.appearance,
                        embeddedWallets: {
                            createOnLogin:
                                privyConfig.embeddedWallets?.createOnLogin ??
                                'all-users',
                        },
                    }}
                    allowPasskeyLinking={privyConfig.allowPasskeyLinking}
                >
                    <DAppKitProvider
                        nodeUrl={dappKitConfig.nodeUrl}
                        genesis={dappKitConfig.genesis}
                        usePersistence
                        walletConnectOptions={
                            dappKitConfig.walletConnectOptions
                        }
                        themeMode={dappKitConfig.themeMode}
                        themeVariables={{
                            '--vdk-modal-z-index': '1000000',
                        }}
                    >
                        <SmartAccountProvider
                            nodeUrl={dappKitConfig.nodeUrl}
                            delegatorUrl={feeDelegationConfig.delegatorUrl}
                            delegateAllTransactions={
                                feeDelegationConfig.delegateAllTransactions
                            }
                        >
                            {children}
                        </SmartAccountProvider>
                    </DAppKitProvider>
                </BasePrivyProvider>
            </ChakraProvider>
        </DAppKitPrivyContext.Provider>
    );
};
