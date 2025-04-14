// Angular modules
import { Component, CUSTOM_ELEMENTS_SCHEMA, type OnInit } from '@angular/core';
import { DAppKitUI } from '@vechain/dapp-kit-ui';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit {
    // -------------------------------------------------------------------------------
    // NOTE Init ---------------------------------------------------------------------
    // -------------------------------------------------------------------------------

    public ngOnInit(): void {
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
    }

    public openModal(): void {
        DAppKitUI.modal.open();
    }

    public sendTx = () =>
        DAppKitUI.signer.sendTransaction({
            clauses: [
                {
                    to: DAppKitUI.wallet.state.address,
                    value: '0x1',
                    data: '0x',
                },
            ],
            comment: 'Send 1 Wei',
        });

    public signTypedData = () =>
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
}
