import { DAppKitUI, friendlyAddress } from './dist';

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
    node: 'https://mainnet.vechain.org',
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

    const render = () => {
        const address = DAppKitUI.wallet.state.address;
        const accountDomain = DAppKitUI.wallet.state.accountDomain;
        const isAccountDomainLoading =
            DAppKitUI.wallet.state.isAccountDomainLoading;

        const addressOrDomain =
            accountDomain && !isAccountDomainLoading
                ? accountDomain
                : friendlyAddress(address || '');

        if (address) {
            customButton.innerText = `Disconnect from ${addressOrDomain}`;
        } else {
            customButton.innerText = 'Connect Custom Button';
        }
    };

    render();

    DAppKitUI.modal.onConnectionStatusChange(render);
    DAppKitUI.wallet.subscribeToKey('address', render);
    DAppKitUI.wallet.subscribeToKey('accountDomain', render);
    DAppKitUI.wallet.subscribeToKey('isAccountDomainLoading', render);
}
