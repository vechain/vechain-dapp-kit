import type { WalletSource } from '@vechain/wallet-kit';
import { MultiWalletConnex } from '@vechain/wallet-kit';
import type { ConnexOptions } from '@vechain/wallet-kit/src';
import type { SourceInfo } from './constants';

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
