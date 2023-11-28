// eslint-disable
'use client'; // This is a client component

import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// eslint-disable-next-line import/no-default-export
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}): React.ReactElement {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
