import type { ConnexOptions } from '@vechainfoundation/dapp-kit';
import { MultiWalletConnex } from '@vechainfoundation/dapp-kit';
import { CustomWalletConnectModal, DAppKitModal } from './modal';

let connex: MultiWalletConnex | null = null;

export type DAppKitOptions = Omit<ConnexOptions, 'customWcModal'> & {
    useWalletKitModal?: boolean;
};

const DAppKit = {
    configure(options: DAppKitOptions): MultiWalletConnex {
        const connexOptions: ConnexOptions = options;

        if (options.useWalletKitModal) {
            connexOptions.customWcModal =
                CustomWalletConnectModal.getInstance();
        }

        connex = new MultiWalletConnex(connexOptions);

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
