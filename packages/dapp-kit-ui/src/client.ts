import type { ConnexOptions, WalletManager } from '@vechainfoundation/dapp-kit';
import { MultiWalletConnex } from '@vechainfoundation/dapp-kit';
import { CustomWalletConnectModal, DAppKitModal } from './modal';

let connex: MultiWalletConnex | null = null;

const DAppKit = {
    configure(options: ConnexOptions): MultiWalletConnex {
        const connexOptions: ConnexOptions = options;

        if (
            options.walletConnectOptions &&
            !options.walletConnectOptions.modal
        ) {
            options.walletConnectOptions.modal =
                CustomWalletConnectModal.getInstance();
        }

        connex = new MultiWalletConnex(connexOptions);

        return connex;
    },

    get thor(): Connex.Thor {
        return this.connex.thor;
    },

    get vendor(): Connex.Vendor {
        return this.connex.vendor;
    },

    get wallet(): WalletManager {
        return this.connex.wallet;
    },

    get modal(): DAppKitModal {
        return DAppKitModal.getInstance(this.wallet);
    },

    get connex(): MultiWalletConnex {
        if (!connex) {
            // eslint-disable-next-line no-console
            console.error('🚨🚨🚨 DAppKit not configured 🚨🚨🚨');
            throw new Error('DAppKit not configured');
        }

        return connex;
    },
};

export { DAppKit };
