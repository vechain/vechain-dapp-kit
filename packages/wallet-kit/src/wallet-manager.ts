import type {
    ConnectResponse,
    ConnexOptions,
    ConnexWallet,
    ConnexWalletManager,
    WalletSource,
} from './types';
import { createWallet } from './create-wallet';

class WalletManager implements ConnexWalletManager {
    private wallets: Record<string, ConnexWallet | undefined> = {};

    constructor(private readonly connexOptions: ConnexOptions) {}

    private _source: WalletSource | null = null;

    public get source(): WalletSource | null {
        return this._source;
    }

    private get wallet(): ConnexWallet {
        const source = this._source;

        if (!source) {
            throw new Error('No wallet has been selected');
        }

        let wallet = this.wallets[source];

        if (!wallet) {
            const opts = { ...this.connexOptions, source };
            wallet = createWallet(opts);

            if (wallet) {
                this.wallets[source] = wallet;
            }
        }

        if (!wallet) {
            throw new Error('Signer is not initialized');
        }

        return wallet;
    }

    connect = (): Promise<ConnectResponse> => this.wallet.connect();

    signIn = (
        msg?: Connex.Vendor.CertMessage,
        options?: Connex.Signer.CertOptions,
    ): Promise<Connex.Vendor.CertResponse> => this.wallet.signIn(msg, options);

    disconnect = async (): Promise<void> => {
        if (!this._source) {
            return;
        }

        const wallet = this.wallets[this._source];

        if (wallet) {
            await wallet.disconnect?.();
        }

        this._source = null;
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
    };
}

export { WalletManager };
