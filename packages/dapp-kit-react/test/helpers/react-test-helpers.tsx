import React from 'react';
import { DAppKitProvider, WalletButton } from '../../src';

export const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <DAppKitProvider
        node="https://testnet.vechain.org"
        logLevel={'DEBUG'}
        v2Api={{ enabled: false }}
    >
        {children}
        <WalletButton />
    </DAppKitProvider>
);
