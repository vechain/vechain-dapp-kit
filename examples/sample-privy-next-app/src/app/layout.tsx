'use client';

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
        <html lang="en">
            <head>
                <title>Privy Next JS</title>
            </head>
            <body>
                <SocialLoginWrapper>{children}</SocialLoginWrapper>
            </body>
        </html>
    );
}
