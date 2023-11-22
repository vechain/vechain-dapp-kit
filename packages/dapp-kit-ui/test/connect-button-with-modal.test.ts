import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
    ConnectButton,
    ConnectButtonWithModal,
    ConnectModal,
    ConnectedAddressBadge,
    ConnectedAddressBadgeWithModal,
    ConnectedAddressModal,
    DAppKit,
    SourceInfo,
} from '../src';
import { elementQueries } from './helpers/element-queries';
import { WalletSource } from '@vechainfoundation/dapp-kit/src';

describe('connect-button-with-modal', () => {
    beforeEach(() => {
        DAppKit.configure({ nodeUrl: 'https://mainnet.vechain.org/' });
    });

    it('Should callback with source when user clicks a wallet and should render the connected address badge once connected', async () => {
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

        // testing the connected address badge

        // mock a connection to the wallet by setting the address
        element.address = '0x00000';

        const connectedAddressBadgeWithModal =
            (await elementQueries.getConnectedAddressBadgeWithModal()) as ConnectedAddressBadgeWithModal;

        expect(connectedAddressBadgeWithModal).toBeDefined();

        const connectedAddressBadge =
            (await elementQueries.getConnectedAddressBadge()) as ConnectedAddressBadge;

        expect(connectedAddressBadge).toBeDefined();

        // open the connected address modal
        connectedAddressBadge.shadowRoot?.querySelector('div')?.click();

        const connectedAddressModal =
            (await elementQueries.getConnectedAddressModal()) as ConnectedAddressModal;

        expect(connectedAddressModal).toBeDefined();

        // disconnect from the wallet by clicking the disconnect button
        connectedAddressModal.shadowRoot?.querySelector('button')?.click();

        await element.updateComplete;

        expect(element.address).toBeUndefined();
    });
});
