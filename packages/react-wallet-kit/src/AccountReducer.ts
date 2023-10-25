import type { WalletSource } from '@vechain/wallet-kit';
import type { AccountState } from './types';

const ACCOUNT_KEY = 'sample-app@account';
const WALLET_SOURCE_KEY = 'sample-app@wallet-source';

export type AccountAction =
    | { type: 'set-address'; payload: { address: string; persist: boolean } }
    | {
          type: 'set-wallet-source';
          payload: { source: WalletSource; persist: boolean };
      }
    | { type: 'clear' };

export const defaultAccountState: AccountState = {
    address: localStorage.getItem(ACCOUNT_KEY),
    source: localStorage.getItem(WALLET_SOURCE_KEY) as WalletSource,
};

export const accountReducer = (
    state: AccountState,
    action: AccountAction,
): AccountState => {
    switch (action.type) {
        case 'set-address': {
            const { address, persist } = action.payload;
            if (persist) {
                localStorage.setItem(ACCOUNT_KEY, address);
            }
            return { ...state, address };
        }
        case 'set-wallet-source': {
            const { source, persist } = action.payload;
            if (persist) {
                localStorage.setItem(WALLET_SOURCE_KEY, source);
            }
            return { ...state, source };
        }
        case 'clear':
            localStorage.removeItem(ACCOUNT_KEY);
            localStorage.removeItem(WALLET_SOURCE_KEY);
            return { address: null, source: null };
    }
};
