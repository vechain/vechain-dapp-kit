import { WalletConnectOptions } from '@vechain/dapp-kit';
import { DAppKitProvider } from '@vechain/dapp-kit-react';
import React from 'react';
import renderer from 'react-test-renderer';
import { expect, test } from 'vitest';
import App from '../src/App';

test('Welcome', async () => {
    const walletConnectOptions: WalletConnectOptions = {
        projectId: 'a0b855ceaf109dbc8426479a4c3d38d8',
        metadata: {
            name: 'Sample VeChain dApp',
            description: 'A sample VeChain dApp',
            url: window.location.origin,
            icons: [``],
        },
    };
    const component = renderer.create(
        <React.StrictMode>
            <DAppKitProvider
                node={'https://testnet.vechain.org/'}
                usePersistence
                walletConnectOptions={walletConnectOptions}
                v2Api={{ enabled: true }}
            >
                <App />
            </DAppKitProvider>
        </React.StrictMode>,
    );

    const tree = component.toJSON();
    expect(tree).toBeDefined();
});
