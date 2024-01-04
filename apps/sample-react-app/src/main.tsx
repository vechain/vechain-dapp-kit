import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import type { WalletConnectOptions } from '@vechain/dapp-kit';
import '@vechain/dapp-kit-ui';
import { DAppKitProvider } from '@vechain/dapp-kit-react';

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
            nodeUrl={'https://testnet.vechain.org/'}
            genesis={'test'}
            usePersistence
            walletConnectOptions={walletConnectOptions}
        >
            <App />
        </DAppKitProvider>
    </React.StrictMode>,
);
