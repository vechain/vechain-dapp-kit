import {
    ConnectWalletButtonWithModal,
    ConnexProvider,
    useWallet,
} from '@vechainfoundation/dapp-kit-react';
import type { Options } from '@vechain/connex';
import type { WalletConnectOptions } from '@vechainfoundation/dapp-kit';
import { useEffect } from 'react';

const nodeOptions: Omit<Options, 'signer'> = {
    node: 'https://testnet.vechain.org/',
    network: 'test',
};

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
function ConnectWallet() {
    const { account } = useWallet();

    useEffect(() => {
        if (account) {
            // eslint-disable-next-line no-console
            console.log('account', account);
        }
    }, [account]);

    return <ConnectWalletButtonWithModal />;
}

// eslint-disable-next-line func-style
function HomePage() {
    return (
        <ConnexProvider
            key="connex"
            nodeOptions={nodeOptions}
            persistState
            walletConnectOptions={walletConnectOptions}
        >
            <ConnectWallet />
        </ConnexProvider>
    );
}

// eslint-disable-next-line import/no-default-export
export default HomePage;
