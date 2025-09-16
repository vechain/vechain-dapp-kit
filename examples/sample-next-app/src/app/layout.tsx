'use client'; // This is a client component

import type { WalletConnectOptions } from '@vechain/dapp-kit';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import './globals.css';

const DAppKitProvider = dynamic(
    async () => {
        const { DAppKitProvider: _DAppKitProvider } = await import(
            '@vechain/dapp-kit-react'
        );
        return _DAppKitProvider;
    },
    {
        ssr: false,
    },
);

const inter = Inter({ subsets: ['latin'] });

const walletConnectOptions: WalletConnectOptions = {
    projectId: 'a0b855ceaf109dbc8426479a4c3d38d8',
    metadata: {
        name: 'Sample VeChain dApp',
        description: 'A sample VeChain dApp',
        url: typeof window !== 'undefined' ? window.location.origin : '',
        icons: [
            typeof window !== 'undefined'
                ? `${window.location.origin}/images/logo/my-dapp.png`
                : '',
        ],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}): React.ReactElement {
    return (
        <html lang="en">
            <head>
                <title>Next JS</title>
            </head>
            <body className={inter.className}>
                <DAppKitProvider
                    logLevel="DEBUG"
                    node="https://testnet.vechain.org/"
                    usePersistence
                    walletConnectOptions={walletConnectOptions}
                    v2Api={{ enabled: true }}
                >
                    {children}
                </DAppKitProvider>
            </body>
        </html>
    );
}
