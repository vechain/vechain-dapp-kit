import { DAppKitUI, friendlyAddress } from '@vechain/dapp-kit-ui';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div class="container">
    <h2>Vanilla JS</h2>
    <div class="label">kit button:</div>
    <vdk-button></vdk-button>
    <div class="label">custom button:</div>
    <button id="custom-button">Connect Custom Button</button>
    <div class="label">TX</div>
    <button id="send-tx">Send TX</button>
    <div class="label">Typed Data</div>
    <button id="sign-typed-data-button">Sign Typed Data</button>
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

DAppKitUI.configure({
    node: 'https://testnet.vechain.org/',
    walletConnectOptions,
    usePersistence: true,
});

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

const sendTxButton = document.getElementById('send-tx');
if (sendTxButton) {
    sendTxButton.addEventListener('click', () => {
        DAppKitUI.signer?.sendTransaction({
            clauses: [
                {
                    to: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
                    value: '0x1',
                    data: '0x',
                },
            ],
            comment: 'Send 1 Wei',
        });
    });
}

const signTypedDataButton = document.getElementById('sign-typed-data-button');
if (signTypedDataButton) {
    signTypedDataButton.addEventListener('click', () => {
        DAppKitUI.signer.signTypedData(
            {
                name: 'Test Data',
                version: '1',
                chainId: 1,
                verifyingContract: '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68',
            },
            { test: [{ name: 'test', type: 'address' }] },
            { test: '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68' },
        );
    });
}
