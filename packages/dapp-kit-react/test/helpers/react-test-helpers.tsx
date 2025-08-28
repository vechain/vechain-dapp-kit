import { TESTNET_NETWORK } from '@vechain/sdk-core';
import React from 'react';
import { DAppKitProvider, WalletButton } from '../../src';

export const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <DAppKitProvider
        node="https://testnet.vechain.org"
        logLevel={'DEBUG'}
        v2Api={{ enabled: false }}
        genesisId={TESTNET_NETWORK.genesisBlock.id}
    >
        {children}
        <WalletButton />
    </DAppKitProvider>
);
