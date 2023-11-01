import { inject } from 'vue';
import Connex from '@vechain/connex';
import {
    ConnexSymbol,
    WalletActionsSymbol,
    WalletStateSymbol,
} from '@/connex/keys';
import { WalletActions, WalletState } from '@/connex/types';

const injectConnex = (): Connex => inject<Connex>(ConnexSymbol, {} as Connex);

const injectWalletState = (): WalletState =>
    inject(WalletStateSymbol, {} as WalletState);

const injectWalletActions = (): WalletActions =>
    inject(WalletActionsSymbol, {} as WalletActions);

export { injectConnex, injectWalletState, injectWalletActions };
