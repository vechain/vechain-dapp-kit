import type { WalletConnectOptions } from '@vechain/dapp-kit';
import { DAppKitProvider } from '@vechain/dapp-kit-react';
import '@vechain/dapp-kit-ui';
import { TESTNET_NETWORK } from '@vechain/sdk-core';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const walletConnectOptions: WalletConnectOptions = {
    projectId: 'a0b855ceaf109dbc8426479a4c3d38d8',
    metadata: {
        name: 'Sample VeChain dApp',
        description: 'A sample VeChain dApp',
        url: window.location.origin,
        icons: [`${window.location.origin}/images/logo/my-dapp.png`],
    },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <DAppKitProvider
            node={'https://testnet.vechain.org'}
            usePersistence
            walletConnectOptions={walletConnectOptions}
            logLevel={'DEBUG'}
            v2Api={{ enabled: true }}
            genesisId={TESTNET_NETWORK.genesisBlock.id}
        >
            <App />
        </DAppKitProvider>
    </React.StrictMode>,
);
