import type { WalletSource } from '@vechainfoundation/wallet-kit';
import { MultiWalletConnex } from '@vechainfoundation/wallet-kit';
import type { ConnexOptions } from '@vechainfoundation/wallet-kit/src';
import type { SourceInfo } from './constants';
import './components';

export type VechainWalletKitOptions = MultiWalletConnex | ConnexOptions;

class VechainWalletKit {
    connex: MultiWalletConnex;
    account: string | null = null;

    constructor(options: VechainWalletKitOptions) {
        if ('thor' in options) {
            this.connex = options;
        } else {
            this.connex = new MultiWalletConnex(options);
        }
    }

    setSource = (wallet: WalletSource): void => {
        this.connex.wallet.setSource(wallet);
    };
}

class VechainWalletKitModal {
    public walletKit: VechainWalletKit;

    constructor(walletKit: VechainWalletKit) {
        this.walletKit = walletKit;
    }

    initModalListeners(): void {
        addEventListener('vwk-source-card-clicked', (event) => {
            const source = (event as CustomEvent).detail as SourceInfo;
            // eslint-disable-next-line no-console
            console.log('vwk-source-card-clicked', source);
            this.walletKit.setSource(source.id);
            this.walletKit.connex.wallet
                .connect()
                .then(({ account }) => {
                    // eslint-disable-next-line no-console
                    console.log('account connected', account);
                    this.walletKit.account = account;
                })
                .catch((error) => {
                    // eslint-disable-next-line no-console
                    console.error(error);
                });
        });
    }
}

export const configureThorModal = (
    walletKit: VechainWalletKitOptions,
): void => {
    const vechainWalletKit = new VechainWalletKit(walletKit);
    const vechainWalletKitModal = new VechainWalletKitModal(vechainWalletKit);
    vechainWalletKitModal.initModalListeners();
};
