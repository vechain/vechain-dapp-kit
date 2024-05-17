import { proxy, subscribe } from 'valtio/vanilla';
import { subscribeKey } from 'valtio/vanilla/utils';
import {
    CertificateResponse,
    CertMessage,
    CertOptions,
    ConnectResponse,
    DAppKitOptions,
    ExtendedClause,
    RemoteWallet,
    SendTxOptions,
    WalletTransactionResponse,
    ThorClient,
    WalletManagerState,
    WalletSource,
    TransactionResponse
} from '../types';
import { createWallet, DAppKitLogger, Storage } from '../utils';
import { DEFAULT_CONNECT_CERT_MESSAGE, WalletSources } from '../constants';
import { certificate } from '@vechain/sdk-core';

class WalletManager {
    public readonly state: WalletManagerState;
    private wallets: Record<string, RemoteWallet | undefined> = {};

    constructor(
        private readonly options: DAppKitOptions,
        private readonly thorClient: ThorClient,
    ) {
        this.state = this.initState(options.usePersistence ?? false);
        this.initPersistence(options.usePersistence ?? false);
        DAppKitLogger.debug('WalletManager', 'constructor', this.state);

        if (window.vechain?.isInAppBrowser === true) {
            this.setSource('veworld');
        } else if (options.useFirstDetectedSource) {
            this.setFirstDetectedSource();
        }
    }

    private get wallet(): RemoteWallet {
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

    // this is needed for wallet connect connections when a connection certificate is required
    signConnectionCertificate = async (): Promise<ConnectResponse> => {
        const certificateMessage =
            this.options.connectionCertificate?.message ||
            DEFAULT_CONNECT_CERT_MESSAGE;
        const certificateOptions =
            this.options.connectionCertificate?.options || {};
        const {
            annex: { domain, signer, timestamp },
            signature,
        } = await this.wallet.signCert(certificateMessage, certificateOptions);

        const connectionCertificate = {
            ...certificateMessage,
            signature,
            signer,
            domain,
            timestamp,
        };

        try {
            certificate.verify(connectionCertificate);
            this.state.address = signer;
            this.state.connectionCertificate = connectionCertificate;
            return {
                account: signer,
                verified: true,
                connectionCertificate,
            };
        } catch (e) {
            return {
                account: signer,
                verified: false,
            };
        } finally {
            this.options.walletConnectOptions?.modal?.onConnectionCertificateSigned?.();
        }
    };

    connect = (): Promise<ConnectResponse> =>
        this.wallet
            .connect()
            .then((res: ConnectResponse) => {
                if (
                    this.state.source === 'wallet-connect' &&
                    this.options.requireCertificate &&
                    this.options.walletConnectOptions?.modal
                        ?.askForConnectionCertificate
                ) {
                    this.options.walletConnectOptions.modal.askForConnectionCertificate();
                } else {
                    this.state.address = res.account;
                    this.state.connectionCertificate =
                        res.connectionCertificate ?? null;
                }
                return res;
            })
            .catch((e: unknown) => {
                DAppKitLogger.error('WalletManager', 'connect', e);
                throw e;
            });

    disconnect = (remote = false): void => {
        if (!this.state.source) {
            this.state.source = null;
            this.state.address = null;
            this.state.connectionCertificate = null;
            return;
        }

        DAppKitLogger.debug(
            'WalletManager',
            'disconnect',
            'current source',
            this.state.source,
        );

        const wallet = this.wallets[this.state.source];

        if (wallet && !remote && wallet.disconnect) {
            const res = wallet.disconnect();

            if (res instanceof Promise) {
                res.catch((e) => {
                    DAppKitLogger.error('WalletManager', 'disconnect', e);
                });
            }
        }

        this.state.source = null;
        this.state.address = null;
        this.state.connectionCertificate = null;
    };

    requestTransaction = (
        msg: ExtendedClause[],
        options: SendTxOptions = {},
    ): Promise<TransactionResponse> =>
        this.wallet
            .signTx(msg, options)
            .then((res: WalletTransactionResponse) => {
                // TODO: we should probably remove these assignment, because the user should be already logged in, and the address should be already defined, test it after e2e with transactions
                this.state.address = res.signer;
                return {
                    signer: res.signer,
                    txid: res.txid,
                    wait: async () =>
                        this.thorClient.transactions.waitForTransaction(
                            res.txid,
                        ),
                };
            })
            .catch((e: unknown) => {
                DAppKitLogger.error('WalletManager', 'signTx', e);
                throw e;
            });

    signCert = (
        msg: CertMessage,
        options: CertOptions = {},
    ): Promise<CertificateResponse> =>
        this.wallet
            .signCert(msg, options)
            .then((res: CertificateResponse) => {
                // TODO: we should probably remove these assignment, because the user should be already logged in, and the address should be already defined, test it after e2e with transactions
                this.state.address = res.annex.signer;
                return res;
            })
            .catch((e: unknown) => {
                DAppKitLogger.error('WalletManager', 'signCert', e);
                throw e;
            });

    setSource = (src: WalletSource): void => {
        if (this.state.source === src) {
            return;
        }

        if (this.state.source && this.state.source !== src) {
            this.disconnect();
        }

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

        this.disconnect();
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
                connectionCertificate: null,
            });
        }

        const address = Storage.getAccount();
        const source = Storage.getSource();
        const connectionCertificate = Storage.getConnectionCertificate();

        return proxy({
            source,
            address,
            availableSources,
            connectionCertificate,
        });
    };

    private initPersistence = (usePersistence: boolean): void => {
        if (!usePersistence) {
            return;
        }
        this.subscribeToKey('address', Storage.setAccount);
        this.subscribeToKey('source', Storage.setSource);
        this.subscribeToKey(
            'connectionCertificate',
            Storage.setConnectionCertificate,
        );
    };

    private getAvailableSources = (): WalletSource[] => {
        const wallets: WalletSource[] = [];

        wallets.push('veworld');

        if (this.options.walletConnectOptions) {
            wallets.push('wallet-connect');
        }

        wallets.push('sync2');

        if (window.connex) {
            wallets.push('sync');
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
