import type { WalletSource } from '@vechainfoundation/wallet-kit';
import { MultiWalletConnex } from '@vechainfoundation/wallet-kit';
import type { ConnexOptions } from '@vechainfoundation/wallet-kit/src';
import type { WCModal } from '@vechainfoundation/wallet-connect';
import type { OpenOptions } from '@vechainfoundation/wallet-connect/src/types';
import './components';
import type { SourceInfo } from './constants';

export type VechainWalletKitOptions = MultiWalletConnex | ConnexOptions;

class CustomWalletConnectModal implements WCModal {
    openModal(options: OpenOptions): Promise<void> {
        const { uri } = options;
        dispatchEvent(new CustomEvent('vwk-open-wc-modal', { detail: uri }));
        return Promise.resolve();
    }
    closeModal(): void {
        // NOT USED because it is controlled from inside the component
        // dispatchEvent(new CustomEvent('vwk-close-wc-modal'));
    }
    subscribeModal() {
        // NOT USED because it is controlled from inside the component
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return (): void => {};
    }
}

class VechainWalletKit {
    connex: MultiWalletConnex;
    account: string | null = null;

    constructor(options: VechainWalletKitOptions) {
        if ('thor' in options) {
            this.connex = options;
        } else {
            this.connex = new MultiWalletConnex(
                this.addCustomWalletConnectModalIfNotPresent(options),
            );
        }
    }

    addCustomWalletConnectModalIfNotPresent(
        options: ConnexOptions,
    ): ConnexOptions {
        return {
            ...options,
            customWcModal:
                options.customWcModal || new CustomWalletConnectModal(),
        };
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
        const disconnect = (): void => {
            this.walletKit.connex.wallet.disconnect().catch((error) => {
                // eslint-disable-next-line no-console
                console.error(error);
            });
        };
        addEventListener('vwk-close-wc-modal', disconnect);
    }
}

export const configureThorModal = (
    walletKitOptions: VechainWalletKitOptions,
): void => {
    const vechainWalletKit = new VechainWalletKit(walletKitOptions);
    const vechainWalletKitModal = new VechainWalletKitModal(vechainWalletKit);
    vechainWalletKitModal.initModalListeners();
};
