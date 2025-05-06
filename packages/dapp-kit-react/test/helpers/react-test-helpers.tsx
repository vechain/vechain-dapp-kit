import React from 'react';
import { WalletButton, DAppKitProvider } from '../../src';

export const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <DAppKitProvider node="https://testnet.vechain.org" logLevel={'DEBUG'}>
        {children}
        <WalletButton />
    </DAppKitProvider>
);
