import { inject } from 'vue';
import Connex from '@vechain/connex';
import { ConnexSymbol, WalletSymbol } from '@/providers/keys';
import { Wallet } from '@/providers/types';

export const injectConnex = (): Connex =>
    inject<Connex>(ConnexSymbol, {} as Connex);

export const injectWallet = (): Wallet => inject(WalletSymbol, {} as Wallet);
