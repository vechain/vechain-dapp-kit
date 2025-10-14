'use client'; // This is a client component

import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import './globals.css';

const Provider = dynamic(
    async () => {
        const { Provider: _DAppKitProvider } = await import(
            '../providers/provider'
        );
        return _DAppKitProvider;
    },
    {
        ssr: false,
    },
);

const inter = Inter({ subsets: ['latin'] });

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
                <Provider>{children}</Provider>
            </body>
        </html>
    );
}
