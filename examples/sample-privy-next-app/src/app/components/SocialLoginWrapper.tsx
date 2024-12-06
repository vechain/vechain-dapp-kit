'use client';

import dynamic from 'next/dynamic';

const PrivyProvider = dynamic(
    async () =>
        (await import('@vechain/dapp-kit-react-privy')).DAppKitPrivyProvider,
    {
        ssr: false,
    },
);

interface Props {
    children: React.ReactNode;
}

export function SocialLoginWrapper({ children }: Props) {
    return (
        <PrivyProvider
            privyConfig={{
                appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
                clientId: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!,
                loginMethods: ['google', 'twitter'],
                appearance: {
                    theme: 'light',
                    accentColor: '#696FFD',
                    loginMessage: 'Select a social media profile',
                    logo: 'https://i.ibb.co/ZHGmq3y/image-21.png',
                },
                embeddedWallets: {
                    createOnLogin: 'all-users',
                },
            }}
            smartAccountConfig={{
                nodeUrl: 'https://node.vechain.energy',
                delegatorUrl: 'https://delegator.vechain.energy',
                accountFactoryAddress:
                    '0x0000000000000000000000000000000000000000',
            }}
            dappKitConfig={{
                nodeUrl: 'https://node.vechain.energy',
                genesis: {
                    number: 0,
                    id: '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a',
                    size: 170,
                    parentID:
                        '0xffffffff53616c757465202620526573706563742c20457468657265756d2100',
                    timestamp: 1530316800,
                    gasLimit: 10000000,
                    beneficiary: '0x0000000000000000000000000000000000000000',
                    gasUsed: 0,
                    totalScore: 0,
                    txsRoot:
                        '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                    txsFeatures: 0,
                    stateRoot:
                        '0x09bfdf9e24dd5cd5b63f3c1b5d58b97ff02ca0490214a021ed7d99b93867839c',
                    receiptsRoot:
                        '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                    signer: '0x0000000000000000000000000000000000000000',
                    isTrunk: true,
                    transactions: [],
                },
                colorMode: 'LIGHT',
                projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
                walletConnectOptions: {
                    projectId:
                        process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
                    metadata: {
                        name: 'Your App',
                        description: 'Your app description',
                        url:
                            typeof window !== 'undefined'
                                ? window.location.origin
                                : '',
                        icons: [
                            typeof window !== 'undefined'
                                ? `${window.location.origin}/images/logo/my-dapp.png`
                                : '',
                        ],
                    },
                },
            }}
        >
            {children}
        </PrivyProvider>
    );
}
