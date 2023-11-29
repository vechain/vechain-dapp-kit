import { DAppKit } from '@vechainfoundation/dapp-kit-ui';

const walletConnectOptions = {
    projectId: 'a0b855ceaf109dbc8426479a4c3d38d8',
    metadata: {
        name: 'Sample VeChain dApp',
        description: 'A sample VeChain dApp',
        url: window.location.origin,
        icons: [`${window.location.origin}/images/logo/my-dapp.png`],
    },
};

const vechainWalletKitOptions = {
    nodeUrl: 'https://testnet.vechain.org/',
    network: 'test',
    walletConnectOptions,
    useWalletKitModal: true,
    usePersistence: true,
};

DAppKit.configure(vechainWalletKitOptions);
