import { WalletSource } from '@vechain/wallet-kit';
import { ConnectResponse } from '@vechain/wallet-kit/src/types';

type WalletState = {
    availableWallets: WalletSource[];
    source: WalletSource | null;
    account: string | null;
};

type WalletActions = {
    setAccount: (account: string) => void;
    setSource: (source: WalletSource) => void;
    connect: () => Promise<ConnectResponse>;
    disconnect: () => void;
};
