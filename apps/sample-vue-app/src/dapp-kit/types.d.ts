import { ConnectResponse, WalletSource } from '@vechain/dapp-kit';

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
