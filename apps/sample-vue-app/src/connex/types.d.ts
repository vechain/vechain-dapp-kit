import { WalletSource } from '@vechain/wallet-kit';

type WalletState = {
    wallets: WalletSource[];
    availableWallets: WalletSource[];
    source: WalletSource | null;
    account: string | null;
};

type WalletActions = {
    updateAccount: (account: string) => void;
    updateSource: (source: WalletSource) => void;
};
