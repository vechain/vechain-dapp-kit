// Angular modules
import { CUSTOM_ELEMENTS_SCHEMA, Component, type OnInit } from '@angular/core';
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
}
