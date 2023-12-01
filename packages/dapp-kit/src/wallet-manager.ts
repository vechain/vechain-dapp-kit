import { proxy, subscribe } from 'valtio';
import { subscribeKey } from 'valtio/utils';
import type {
    ConnectResponse,
    ConnexWallet,
    DAppKitOptions,
    WalletManagerState,
    WalletSource,
} from './types';
import { createWallet } from './create-wallet';
import { WalletSources } from './wallet';
import { Storage } from './local-storage';
import { DAppKitLogger } from './utils';

class WalletManager {
    public readonly state: WalletManagerState;
    private wallets: Record<string, ConnexWallet | undefined> = {};

    constructor(private readonly options: DAppKitOptions) {
        this.state = this.initState(options.usePersistence ?? false);
        this.initPersistence(options.usePersistence ?? false);
        DAppKitLogger.debug('WalletManager', 'constructor', this.state);

        if (options.useFirstDetectedSource) {
            this.setFirstDetectedSource();
        }
    }

    private get wallet(): ConnexWallet {
        const source = this.state.source;

        DAppKitLogger.debug(
            'WalletManager',
            'get wallet',
            'current source',
            source,
        );

        if (!source) {
            throw new Error('No wallet has been selected');
        }

        let wallet = this.wallets[source];

        if (!wallet) {
            // If it's not a built-in wallet, we can't create it
            if (!WalletSources.includes(source))
                throw new Error(`No wallet found for: ${source}`);

            DAppKitLogger.debug(
                'WalletManager',
                'get wallet',
                'creating a new wallet',
                source,
            );

            const opts = {
                ...this.options,
                source,
                onDisconnected: () => this.disconnect(true),
            };
            wallet = createWallet(opts);

            this.wallets[source] = wallet;
        }

        return wallet;
    }

    connect = (): Promise<ConnectResponse> =>
        this.wallet
            .connect()
            .then((res) => {
                this.state.address = res.account;
                return res;
            })
            .catch((e) => {
                DAppKitLogger.error('WalletManager', 'connect', e);
                throw e;
            });

    disconnect = async (remote = false): Promise<void> => {
        if (!this.state.source) {
            return;
        }

        DAppKitLogger.debug(
            'WalletManager',
            'disconnect',
            'current source',
            this.state.source,
        );

        const wallet = this.wallets[this.state.source];

        if (wallet && !remote) {
            await wallet.disconnect?.();
        }

        this.state.source = null;
        this.state.address = null;
    };

    signTx = (
        msg: Connex.Vendor.TxMessage,
        options: Connex.Signer.TxOptions,
    ): Promise<Connex.Vendor.TxResponse> =>
        this.wallet
            .signTx(msg, options)
            .then((res) => {
                this.state.address = res.signer;
                return res;
            })
            .catch((e) => {
                DAppKitLogger.error('WalletManager', 'signTx', e);
                throw e;
            });

    signCert = (
        msg: Connex.Vendor.CertMessage,
        options: Connex.Signer.CertOptions,
    ): Promise<Connex.Vendor.CertResponse> =>
        this.wallet
            .signCert(msg, options)
            .then((res) => {
                this.state.address = res.annex.signer;
                return res;
            })
            .catch((e) => {
                DAppKitLogger.error('WalletManager', 'signCert', e);
                throw e;
            });

    setSource = (src: WalletSource): void => {
        if (src === 'wallet-connect' && !this.options.walletConnectOptions) {
            throw new Error('WalletConnect options are not provided');
        }

        if (src === 'veworld' && !window.vechain) {
            throw new Error('VeWorld Extension is not installed');
        }

        if (src === 'sync' && !window.connex) {
            throw new Error('User is not in a Sync wallet');
        }

        DAppKitLogger.debug('WalletManager', 'setSource', src);

        this.state.source = src;
    };

    subscribe = (
        listener: (state: WalletManagerState) => void,
    ): (() => void) => {
        return subscribe(this.state, () => {
            listener(this.state);
        });
    };

    subscribeToKey = <T extends keyof WalletManagerState>(
        key: T,
        listener: (value: WalletManagerState[T]) => void,
    ): (() => void) => {
        return subscribeKey(this.state, key, (value) => {
            listener(value);
        });
    };

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

        if (this.options.walletConnectOptions) {
            wallets.push('wallet-connect');
        }

        return wallets;
    };

    private setFirstDetectedSource = (): void => {
        if (window.vechain) {
            this.setSource('veworld');
        } else if (this.options.walletConnectOptions) {
            this.setSource('wallet-connect');
        } else if (window.connex) {
            this.setSource('sync');
        } else {
            this.setSource('sync2');
        }
    };
}

export { WalletManager };
