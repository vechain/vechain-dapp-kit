// eslint-disable
'use client'; // This is a client component

import { Inter } from 'next/font/google';
import './globals.css';
import type { Options } from '@vechain/connex';
import { ConnexProvider } from '@vechainfoundation/dapp-kit-react';
import type { WalletConnectOptions } from '@vechainfoundation/dapp-kit';

const nodeOptions: Omit<Options, 'signer'> = {
    node: 'https://testnet.vechain.org/',
    network: 'test',
};

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

const inter = Inter({ subsets: ['latin'] });

// eslint-disable-next-line import/no-default-export
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}): React.ReactElement {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ConnexProvider
                    key="connex"
                    nodeOptions={nodeOptions}
                    persistState
                    walletConnectOptions={walletConnectOptions}
                >
                    {children}
                </ConnexProvider>
            </body>
        </html>
    );
}
