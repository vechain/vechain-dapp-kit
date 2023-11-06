import { WalletSource } from '@vechain/wallet-kit';
import { ConnectResponse } from '@vechain/wallet-kit/src/types';

type WalletState = {
    wallets: WalletSource[];
    availableWallets: WalletSource[];
    source: WalletSource | null;
    account: string | null;
};

type WalletActions = {
    updateAccount: (account: string) => void;
    updateSource: (source: WalletSource) => void;
    connect: () => Promise<ConnectResponse>;
    disconnect: () => void;
};
