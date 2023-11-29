// eslint-disable-next-line unicorn/prefer-node-protocol
import { EventEmitter } from 'events';
import { proxy } from 'valtio';
import { subscribeKey } from 'valtio/utils';
import type {
    ConnectResponse,
    ConnexOptions,
    ConnexWallet,
    WalletManagerState,
    WalletSource,
} from './types';
import { createWallet } from './create-wallet';
import { WalletSources } from './wallet';
import { Storage } from './local-storage';

const DISCONNECTED = 'disconnected';
const SOURCE_CHANGED = 'source-changed';

class WalletManager {
    public readonly state: WalletManagerState;
    private wallets: Record<string, ConnexWallet | undefined> = {};
    private eventEmitter = new EventEmitter();

    constructor(private readonly connexOptions: ConnexOptions) {
        this.state = this.initState(connexOptions.usePersistence ?? false);
        this.initPersistence(connexOptions.usePersistence ?? false);
    }

    private get wallet(): ConnexWallet {
        const source = this.state.source;

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

    connect = (): Promise<ConnectResponse> =>
        this.wallet.connect().then((res) => {
            this.state.address = res.account;
            return res;
        });

    disconnect = async (remote = false): Promise<void> => {
        if (!this.state.source) {
            return;
        }

        const wallet = this.wallets[this.state.source];

        if (wallet && !remote) {
            await wallet.disconnect?.();
        }

        this.state.source = null;
        this.state.address = null;
        this.eventEmitter.emit(SOURCE_CHANGED, null);
        this.eventEmitter.emit(DISCONNECTED);
    };

    signTx = (
        msg: Connex.Vendor.TxMessage,
        options: Connex.Signer.TxOptions,
    ): Promise<Connex.Vendor.TxResponse> =>
        this.wallet.signTx(msg, options).then((res) => {
            this.state.address = res.signer;
            return res;
        });

    signCert = (
        msg: Connex.Vendor.CertMessage,
        options: Connex.Signer.CertOptions,
    ): Promise<Connex.Vendor.CertResponse> =>
        this.wallet.signCert(msg, options).then((res) => {
            this.state.address = res.annex.signer;
            return res;
        });

    setSource = (src: WalletSource): void => {
        if (
            src === 'wallet-connect' &&
            !this.connexOptions.walletConnectOptions
        ) {
            throw new Error('WalletConnect options are not provided');
        }

        if (src === 'veworld' && !window.vechain) {
            throw new Error('VeWorld Extension is not installed');
        }

        if (src === 'sync' && !window.connex) {
            throw new Error('User is not in a Sync wallet');
        }

        this.state.source = src;
        this.eventEmitter.emit(SOURCE_CHANGED, src);
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

    private initState = (usePersistent: boolean): WalletManagerState => {
        const availableSources = this.getAvailableSources();

        if (!usePersistent) {
            return proxy({
                source: null,
                address: null,
                availableSources,
            });
        }

        const address = Storage.getAccount();
        const source = Storage.getSource();

        return proxy({
            source,
            address,
            availableSources,
        });
    };

    private initPersistence = (usePersistent: boolean): void => {
        if (!usePersistent) {
            return;
        }
        subscribeKey(this.state, 'address', Storage.setAccount);
        subscribeKey(this.state, 'source', Storage.setSource);
    };

    private getAvailableSources = (): WalletSource[] => {
        const wallets: WalletSource[] = ['sync2'];

        if (window.vechain) {
            wallets.push('veworld');
        }

        if (window.connex) {
            wallets.push('sync');
        }

        if (this.connexOptions.walletConnectOptions) {
            wallets.push('wallet-connect');
        }

        return wallets;
    };
}

export { WalletManager };
