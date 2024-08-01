import { DAppKitUI } from '@vechain/dapp-kit-ui';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
            <h2>Vanilla JS</h2>
            <div class="label">kit button:</div>
            <vdk-button></vdk-button>
            <div class="label">custom button:</div>
            <button id="custom-button">Connect Custom Button</button>
        </div>
`;

const walletConnectOptions = {
    projectId: 'a0b855ceaf109dbc8426479a4c3d38d8',
    metadata: {
        name: 'Sample VeChain dApp',
        description: 'A sample VeChain dApp',
        url: window.location.origin,
        icons: [`${window.location.origin}/images/logo/my-dapp.png`],
    },
};

const vechainDAppKitOptions = {
    nodeUrl: 'https://testnet.vechain.org/',
    genesis: 'test',
    walletConnectOptions,
    usePersistence: true,
};

DAppKitUI.configure(vechainDAppKitOptions);

// custom button configuration

const customButton = document.getElementById('custom-button');

if (customButton) {
    customButton.addEventListener('click', () => {
        DAppKitUI.modal.open();
    });

    const handleConnected = (address: string | null) => {
        if (address) {
            const formattedAddress = `${address.slice(0, 6)}...${address.slice(
                -4,
            )}`;
            customButton.innerText = `Disconnect from ${formattedAddress}`;
        } else {
            customButton.innerText = 'Connect Custom Button';
        }
    };

    handleConnected(DAppKitUI.wallet.state.address);

    DAppKitUI.modal.onConnectionStatusChange(handleConnected);
}
