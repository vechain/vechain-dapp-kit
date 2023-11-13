import type { ConnexOptions } from '@vechainfoundation/wallet-kit';
import { MultiWalletConnex } from '@vechainfoundation/wallet-kit';
import { CustomWalletConnectModal, DAppKitModal } from './modal';

let connex: MultiWalletConnex | null = null;

const DAppKit = {
    configure(options: ConnexOptions): MultiWalletConnex {
        if (!options.customWcModal) {
            options.customWcModal = CustomWalletConnectModal.getInstance();
        }

        connex = new MultiWalletConnex(options);

        return connex;
    },

    get connex(): MultiWalletConnex {
        if (!connex) {
            // eslint-disable-next-line no-console
            console.error('🚨🚨🚨 DAppKit not configured 🚨🚨🚨');
            throw new Error('DAppKit not configured');
        }

        return connex;
    },

    get modal(): DAppKitModal {
        return DAppKitModal.getInstance();
    },
};

export { DAppKit };
