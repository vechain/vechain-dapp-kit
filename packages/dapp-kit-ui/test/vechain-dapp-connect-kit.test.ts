import { beforeEach, describe, expect, it } from 'vitest';

import { DAppKit, DappKitContextProvider, VechainDappConnectKit } from '../src';
import { elementQueries } from './helpers/element-queries';

describe('connect-button-with-modal', () => {
    beforeEach(() => {
        DAppKit.configure({ nodeUrl: 'https://mainnet.vechain.org/' });
    });

    it('Should callback with source when user clicks a wallet and should render the connected address badge once connected', async () => {
        const element: VechainDappConnectKit = window.document.createElement(
            'vwk-vechain-dapp-connect-kit',
        );

        window.document.body.appendChild(element);

        // testing the dapp kit context provider

        // set a not persistent context
        element.notPersistentContext = true;

        const dappKitContextProvider =
            (await elementQueries.getDappKitContextProvider()) as DappKitContextProvider;

        expect(dappKitContextProvider).toBeDefined();

        // check if the context is not persistent
        expect(dappKitContextProvider.notPersistentContext).toBe(true);

        expect(dappKitContextProvider.dappKitContext).toBeDefined();
        expect(dappKitContextProvider.dappKitContext.address).toBe('');
    });
});
