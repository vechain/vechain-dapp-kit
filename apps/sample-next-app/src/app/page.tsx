'use client'; // This is a client component

import React from 'react';
import dynamic from 'next/dynamic';

const ConnectWalletButton = dynamic(() => import('./pages/homepage'), {
    ssr: false,
});

// eslint-disable-next-line import/no-default-export
export default function Page() {
    return (
        <main>
            <ConnectWalletButton />
        </main>
    );
}
