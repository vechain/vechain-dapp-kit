import { inject } from 'vue';
import Connex from '@vechain/connex';
import {
    ConnexSymbol,
    WalletActionsSymbol,
    WalletStateSymbol,
} from '@/connex/keys';
import { WalletActions, WalletState } from '@/connex/types';

const NOT_SETUP = new Error('`ConnexProvider` not setup properly');

const defaultState: WalletState = {
    account: null,
    source: null,
    availableWallets: [],
};

const defaultActions: WalletActions = {
    setAccount: () => {
        throw NOT_SETUP;
    },
    setSource: () => {
        throw NOT_SETUP;
    },
    connect: () => Promise.reject(NOT_SETUP),
    disconnect: () => {
        throw NOT_SETUP;
    },
};

const injectConnex = (): Connex => inject<Connex>(ConnexSymbol, {} as Connex);

const injectWalletState = (): WalletState =>
    inject(WalletStateSymbol, defaultState);

const injectWalletActions = (): WalletActions =>
    inject(WalletActionsSymbol, defaultActions);

export { injectConnex, injectWalletState, injectWalletActions };
