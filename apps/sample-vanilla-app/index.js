// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-undef */
import { DAppKitUI } from '@vechain/dapp-kit-ui';

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
    genesis: 'test',
    walletConnectOptions,
    usePersistence: true,
    themeMode: 'DARK',
};

DAppKitUI.configure(vechainWalletKitOptions);

// custom button configuration

const customButton = document.getElementById('custom-button');

customButton.addEventListener('click', async () => {
    DAppKitUI.modal.open();
});

const handleConnected = (address) => {
    if (address) {
        customButton.innerText = `Disconnect from ${address}`;
    } else {
        customButton.innerText = 'Connect Custom Button';
    }
};

handleConnected(DAppKitUI.wallet.state.address);

DAppKitUI.modal.onConnected(handleConnected);
