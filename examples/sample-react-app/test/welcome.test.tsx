import renderer from 'react-test-renderer';
import React from 'react';
import { expect, test } from 'vitest';
import App from '../src/App';
import { DAppKitProvider } from '@vechain/dapp-kit-react';
import { WalletConnectOptions } from '@vechain/dapp-kit';

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
                genesisId='0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127'
            >
                <App />
            </DAppKitProvider>
        </React.StrictMode>,
    );

    const tree = component.toJSON();
    expect(tree).toBeDefined();
});
