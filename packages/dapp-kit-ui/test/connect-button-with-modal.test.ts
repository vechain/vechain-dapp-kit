import { beforeEach, describe, expect, it } from 'vitest';

import {
    AddressButton,
    AddressButtonWithModal,
    AddressModal,
    ConnectButton,
    ConnectButtonWithModal,
    ConnectModal,
    DAppKitUI,
    SourceInfo,
} from '../src';
import { elementQueries } from './helpers/element-queries';
import { WalletSource } from '@vechainfoundation/dapp-kit';

describe('connect-button-with-modal', () => {
    beforeEach(() => {
        DAppKitUI.configure({ nodeUrl: 'https://mainnet.vechain.org/' });
    });

    it('Should callback with source when user clicks a wallet and should render the connected address button once connected', async () => {
        const element: ConnectButtonWithModal = window.document.createElement(
            'vwk-connect-button-with-modal',
        );

        let selectedSource: WalletSource | undefined;

        element.onSourceClick = (source?: SourceInfo) => {
            selectedSource = source?.id;
        };

        window.document.body.appendChild(element);

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
        element.dappKitContext.address = '0x00000';
        element.requestUpdate();

        const connectedAddressButtonWithModal =
            (await elementQueries.getConnectedAddressButtonWithModal()) as AddressButtonWithModal;

        expect(connectedAddressButtonWithModal).toBeDefined();

        const connectedAddressButton =
            (await elementQueries.getConnectedAddressButton()) as AddressButton;

        expect(connectedAddressButton).toBeDefined();

        // open the connected address modal
        connectedAddressButton.shadowRoot?.querySelector('div')?.click();

        const connectedAddressModal =
            (await elementQueries.getConnectedAddressModal()) as AddressModal;

        expect(connectedAddressModal).toBeDefined();

        // disconnect from the wallet by clicking the disconnect button
        connectedAddressModal.shadowRoot?.querySelector('button')?.click();

        await element.updateComplete;

        expect(element.dappKitContext.address).toBe('');
        expect(DAppKitUI.wallet.state.address).toBe(null);
        expect(DAppKitUI.wallet.state.source).toBe(null);
    });
});
