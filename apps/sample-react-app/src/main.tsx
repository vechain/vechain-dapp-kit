import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import type { Options } from '@vechain/connex';
import type { WalletConnectOptions } from '@vechainfoundation/dapp-kit';
import { ConnexProvider } from '@vechainfoundation/dapp-kit-react';

const nodeOptions: Omit<Options, 'signer'> = {
    node: 'https://testnet.vechain.org/',
    network: 'test',
};

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
        <ConnexProvider
            nodeOptions={nodeOptions}
            persistState={true}
            walletConnectOptions={walletConnectOptions}
        >
            <App />
        </ConnexProvider>
    </React.StrictMode>,
);
