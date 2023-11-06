import type { WalletSource } from '@vechain/wallet-kit';
import { MultiWalletConnex } from '@vechain/wallet-kit';
import type { SourceInfo } from './constants';

export interface VechainWalletKitOptions {
    connex?: MultiWalletConnex;
    nodeUrl: string;
    network: string; // TODO: add a type for this
    walletConnectOptions: {
        projectId: string;
        metadata: {
            name: string;
            description: string;
            url: string;
            icons: string[];
        };
    };
    onDisconnected: () => void;
}

export class VechainWalletKit {
    connex: MultiWalletConnex;
    account: string | null = null;

    constructor(options: VechainWalletKitOptions) {
        if (options.connex) {
            this.connex = options.connex;
        } else {
            this.connex = new MultiWalletConnex({
                nodeUrl: options.nodeUrl,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                genesis: options.network as any,
                walletConnectOptions: options.walletConnectOptions,
                onDisconnected: options.onDisconnected,
            });
        }
    }

    setSource = (wallet: WalletSource): void => {
        this.connex.wallet.setSource(wallet);
    };
}

export class VechainWalletKitModal {
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
