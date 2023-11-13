// eslint-disable-next-line unicorn/prefer-node-protocol
import { EventEmitter } from 'events';
import type {
    ConnectResponse,
    ConnexOptions,
    ConnexWallet,
    WalletSource,
} from './types';
import { createWallet } from './create-wallet';
import { WalletSources } from './wallet';

const DISCONNECTED = 'disconnected';
const SOURCE_CHANGED = 'source-changed';

class WalletManager {
    private wallets: Record<string, ConnexWallet | undefined> = {};

    private eventEmitter = new EventEmitter();
    private _source: WalletSource | null = null;

    constructor(private readonly connexOptions: ConnexOptions) {}

    private get wallet(): ConnexWallet {
        const source = this._source;

        if (!source) {
            throw new Error('No wallet has been selected');
        }

        let wallet = this.wallets[source];

        if (!wallet) {
            // If it's not a built-in wallet, we can't create it
            if (!WalletSources.includes(source))
                throw new Error(`No wallet found for: ${source}`);

            const opts = {
                ...this.connexOptions,
                source,
                onDisconnected: () => this.disconnect(true),
            };
            wallet = createWallet(opts);

            this.wallets[source] = wallet;
        }

        return wallet;
    }

    connect = (): Promise<ConnectResponse> => this.wallet.connect();

    disconnect = async (remote = false): Promise<void> => {
        if (!this._source) {
            return;
        }

        const wallet = this.wallets[this._source];

        if (wallet && !remote) {
            await wallet.disconnect?.();
        }

        this._source = null;
        this.eventEmitter.emit(SOURCE_CHANGED, null);
        this.eventEmitter.emit(DISCONNECTED);
    };

    signTx = (
        msg: Connex.Vendor.TxMessage,
        options: Connex.Signer.TxOptions,
    ): Promise<Connex.Vendor.TxResponse> => this.wallet.signTx(msg, options);

    signCert = (
        msg: Connex.Vendor.CertMessage,
        options: Connex.Signer.CertOptions,
    ): Promise<Connex.Vendor.CertResponse> =>
        this.wallet.signCert(msg, options);

    setSource = (src: WalletSource): void => {
        if (
            src === 'wallet-connect' &&
            !this.connexOptions.walletConnectOptions
        ) {
            throw new Error('WalletConnect options are not provided');
        }

        if (src === 'veworld-extension' && !window.vechain) {
            throw new Error('VeWorld Extension is not installed');
        }

        if (src === 'sync' && !window.connex) {
            throw new Error('User is not in a Sync wallet');
        }

        this._source = src;
        this.eventEmitter.emit(SOURCE_CHANGED, src);
    };

    getSource = (): WalletSource | null => this._source;

    getAvailableSources = (): WalletSource[] => {
        const wallets: WalletSource[] = ['sync2'];

        if (window.vechain) {
            wallets.push('veworld-extension');
        }

        if (window.connex) {
            wallets.push('sync');
        }

        if (this.connexOptions.walletConnectOptions) {
            wallets.push('wallet-connect');
        }

        return wallets;
    };

    onDisconnected(listener: () => void): void {
        this.eventEmitter.on(DISCONNECTED, listener);
    }

    removeOnDisconnected(listener: () => void): void {
        this.eventEmitter.off(DISCONNECTED, listener);
    }

    onSourceChanged(listener: (source: WalletSource | null) => void): void {
        this.eventEmitter.on(SOURCE_CHANGED, listener);
    }

    removeOnSourceChanged(
        listener: (source: WalletSource | null) => void,
    ): void {
        this.eventEmitter.off(SOURCE_CHANGED, listener);
    }
}

export { WalletManager };
