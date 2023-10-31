import { WalletSource } from '@vechain/wallet-kit';

type WalletContext = {
    wallets: WalletSource[];
    availableWallets: WalletSource[];
    source: WalletSource | null;
    account: string | null;
};

type WalletUpdate = {
    updateAccount: (account: string) => void;
    updateSource: (source: WalletSource) => void;
};

type Wallet = WalletContext & WalletUpdate;
