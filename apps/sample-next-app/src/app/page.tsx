'use client'; // This is a client component

import {
    ConnectWalletButtonWithModal,
    useWallet,
} from '@vechainfoundation/dapp-kit-react';
import React, { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, import/no-default-export
export default function Home() {
    const { account } = useWallet();

    useEffect(() => {
        // eslint-disable-next-line no-console
        console.log('account', account);
    }, [account]);

    return (
        <main>
            <ConnectWalletButtonWithModal />
        </main>
    );
}
