// Angular modules
import { Component, CUSTOM_ELEMENTS_SCHEMA, type OnInit } from '@angular/core';
import { CertificateMessage, TypedDataMessage } from '@vechain/dapp-kit';
import { DAppKitUI, DAppKitUIOptions } from '@vechain/dapp-kit-ui';

type OnConnectRequest = NonNullable<
    DAppKitUIOptions['v2Api']['onConnectRequest']
>;
type OnConnectResponse = NonNullable<
    DAppKitUIOptions['v2Api']['onConnectResponse']
>;

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

    private onConnectRequest: OnConnectRequest = () => Promise.resolve(null);
    private onConnectResponse: OnConnectResponse = () => Promise.resolve();

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
            v2Api: {
                enabled: true,
                onConnectRequest: (...args) => this.onConnectRequest(...args),
                onConnectResponse: (...args) => this.onConnectResponse(...args),
            },
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

    public triggerCertificate = () =>
        (this.onConnectRequest = () =>
            Promise.resolve({
                payload: {
                    //<<veworld_address>> will be replaced by the user's wallet on VeWorld mobile
                    content:
                        'Test Message. Here is the user wallet: <<veworld_address>>',
                    type: 'text',
                },
                purpose: 'identification',
            } satisfies CertificateMessage));

    public triggerNull = () =>
        (this.onConnectRequest = () => Promise.resolve(null));
    public triggerSignTypedData = () =>
        (this.onConnectRequest = () =>
            Promise.resolve({
                domain: {
                    name: 'Test Data',
                    version: '1',
                    chainId: 1,
                    verifyingContract:
                        '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68',
                },
                types: {
                    test: [
                        { name: 'test', type: 'address' },
                        { name: 'veworld_login_address', type: 'address' },
                    ],
                },
                value: {
                    test: '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68',
                    //This will be replaced by the user's wallet on VeWorld mobile.
                    veworld_login_address:
                        '0x0000000000000000000000000000000000000000',
                },
            } satisfies TypedDataMessage));
}
