import {
    ConnectButtonWithModal,
    DAppKitProvider,
} from '@vechain/dapp-kit-react';
import type { WalletConnectOptions } from '@vechain/dapp-kit';

const walletConnectOptions: WalletConnectOptions = {
    projectId: 'a0b855ceaf109dbc8426479a4c3d38d8',
    metadata: {
        name: 'Sample VeChain dApp',
        description: 'A sample VeChain dApp',
        url: typeof window !== 'undefined' ? window.location.origin : '',
        icons: [
            typeof window !== 'undefined'
                ? `${window.location.origin}/images/logo/my-dapp.png`
                : '',
        ],
    },
};

// eslint-disable-next-line func-style
function HomePage() {
    return (
        <DAppKitProvider
            genesis="test"
            nodeUrl="https://testnet.vechain.org/"
            usePersistence
            walletConnectOptions={walletConnectOptions}
        >
            <ConnectButtonWithModal />
        </DAppKitProvider>
    );
}

// eslint-disable-next-line import/no-default-export
export default HomePage;
