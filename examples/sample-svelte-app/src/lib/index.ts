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

DAppKitUI.configure({
    node: 'https://testnet.vechain.org/',
    walletConnectOptions,
    usePersistence: true,
});

// custom button configuration
setTimeout(() => {
    const customButton = document.getElementById('custom-button');
    if (customButton) {
        customButton.addEventListener('click', () => {
            DAppKitUI.modal.open();
        });

        const handleConnected = (address: string | null): void => {
            if (address) {
                const formattedAddress = `${address.slice(
                    0,
                    6,
                )}...${address.slice(-4)}`;
                customButton.innerText = `Disconnect from ${formattedAddress}`;
            } else {
                customButton.innerText = 'Connect Custom Button';
            }
        };

        handleConnected(DAppKitUI.wallet.state.address);

        DAppKitUI.modal.onConnectionStatusChange(handleConnected);
    }

    const sendTxButton = document.getElementById('send-tx-button');
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

    const signTypedDataButton = document.getElementById(
        'sign-typed-data-button',
    );
    if (signTypedDataButton) {
        signTypedDataButton.addEventListener('click', () => {
            DAppKitUI.signer.signTypedData(
                {
                    name: 'Test Data',
                    version: '1',
                    chainId: 1,
                    verifyingContract:
                        '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68',
                },
                { test: [{ name: 'test', type: 'address' }] },
                { test: '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68' },
            );
        });
    }
}, 100);
