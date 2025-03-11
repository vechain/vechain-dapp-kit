import { beforeEach, describe, expect, it } from 'vitest';

import {
    AddressButton,
    AddressModal,
    Button,
    ConnectButton,
    ConnectModal,
    DAppKitUI,
    Modal,
    SourceInfo,
} from '../src';
import { elementQueries } from './helpers/element-queries';
import { WalletSource } from '@vechain/dapp-kit';

const themeVariables = {
    '--vdk-color-dark-primary': '#000000',
};

describe('button', () => {
    beforeEach(() => {
        DAppKitUI.configure({
            node: 'https://mainnet.vechain.org/',
            themeVariables,
        });
    });

    it('Should callback with source when user clicks a wallet and should render the connected address button once connected', async () => {
        const button: Button = window.document.createElement('vdk-button');

        window.document.body.appendChild(button);

        const modal: Modal = window.document.body.querySelector('vdk-modal')!;

        let selectedSource: WalletSource | undefined;

        modal.onSourceClick = (source?: SourceInfo) => {
            selectedSource = source?.id;
        };

        // testing the connect button
        const connectButton =
            (await elementQueries.getConnectButton()) as ConnectButton;
        const connectModal =
            (await elementQueries.getConnectModal()) as ConnectModal;

        expect(connectModal).toBeDefined();
        expect(connectButton).toBeDefined();

        expect(connectModal.open).toBe(false);

        connectButton.shadowRoot?.querySelector('button')?.click();

        await new Promise((resolve) => setTimeout(resolve, 1000));

        expect(connectModal.open).toBe(true);

        const sourceCards = await elementQueries.getAllSourceCards();

        expect(sourceCards.length).toBeGreaterThan(0);

        sourceCards[0]?.shadowRoot?.querySelector('div')?.click();

        await new Promise((resolve) => setTimeout(resolve, 1000));

        expect(selectedSource).toBeDefined();

        // testing the connected address button

        // mock a connection to the wallet by setting the address
        button.address = '0x00000';
        button.requestUpdate();

        modal.address = '0x00000';
        modal.requestUpdate();

        const addressButton =
            (await elementQueries.getAddressButton()) as AddressButton;

        expect(addressButton).toBeDefined();

        // open the connected address modal
        addressButton.shadowRoot?.querySelector('div')?.click();

        const addressModal =
            (await elementQueries.getAddressModal()) as AddressModal;

        expect(addressModal).toBeDefined();

        // disconnect from the wallet by clicking the disconnect button
        addressModal.shadowRoot?.querySelector('button')?.click();
        await modal.updateComplete;

        expect(DAppKitUI.wallet.state.address).toBe(null);
        expect(DAppKitUI.wallet.state.source).toBe(null);
    });
});
