'use client'; // This is a client component

import { ConnectWalletButtonWithModal } from '@vechainfoundation/dapp-kit-react';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, import/no-default-export
export default function Home() {
    return (
        <main>
            <ConnectWalletButtonWithModal />
        </main>
    );
}
