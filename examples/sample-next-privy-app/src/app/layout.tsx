'use client';

import { ChakraProvider } from '@chakra-ui/react';
import './globals.css';
import dynamic from 'next/dynamic';

const SocialLoginWrapper = dynamic(
    async () =>
        (await import('./components/SocialLoginWrapper')).SocialLoginWrapper,
    {
        ssr: false,
    },
);

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <title>Privy Next JS</title>
            </head>
            <body>
                <ChakraProvider>
                    <SocialLoginWrapper>{children}</SocialLoginWrapper>
                </ChakraProvider>
            </body>
        </html>
    );
}
