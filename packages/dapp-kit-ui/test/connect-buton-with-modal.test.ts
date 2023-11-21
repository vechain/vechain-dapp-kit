import { beforeEach, describe, expect, it } from 'vitest';

import {
    ConnectButton,
    ConnectButtonWithModal,
    ConnectModal,
    DAppKit,
    SourceInfo,
} from '../src';
import { elementQueries } from './helpers/elemnt-queries';
import { WalletSource } from '@vechainfoundation/dapp-kit/src';

describe('connect-button-with-modal', () => {
    beforeEach(() => {
        DAppKit.configure({ nodeUrl: 'https://mainnet.vechain.org/' });
    });

    it('Should callback with source when user clicks a wallet', async () => {
        const element: ConnectButtonWithModal = window.document.createElement(
            'vwk-connect-button-with-modal',
        );

        let selectedSource: WalletSource | undefined;

        element.onSourceClick = (source?: SourceInfo) => {
            selectedSource = source?.id;
        };

        window.document.body.appendChild(element);

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
    });
});
