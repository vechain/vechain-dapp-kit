import { proxy, subscribe } from 'valtio/vanilla';
import { subscribeKey } from 'valtio/vanilla/utils';
import { certificate } from '@vechain/sdk-core';
import { type ethers } from 'ethers';
import { type DriverNoVendor } from '@vechain/connex-driver';
import { type SignTypedDataOptions } from '../types/types';
import type {
    ConnectResponse,
    ConnexWallet,
    DAppKitOptions,
    WalletManagerState,
    WalletSource,
} from '../types';
import { DAppKitLogger, Storage, createWallet } from '../utils';
import { DEFAULT_CONNECT_CERT_MESSAGE, WalletSources } from '../constants';
import { getAccountDomain } from '../utils/get-account-domain';

class WalletManager {
    public readonly state: WalletManagerState;
    private wallets: Record<string, ConnexWallet | undefined> = {};

    constructor(
        private readonly options: DAppKitOptions,
        private readonly driver: DriverNoVendor,
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

    /**
     * Set the account domain
     */
    setAccountDomain = (address: string | null): void => {
        if (address) {
            this.state.isAccountDomainLoading = true;

            getAccountDomain({ address, driver: this.driver })
                .then((domain) => {
                    this.state.accountDomain = domain;
                })
                .catch((e) => {
                    console.error('Error getting account domain', e);
                    this.state.accountDomain = null;
                })
                .finally(() => {
                    this.state.isAccountDomainLoading = false;
                });
        } else {
            this.state.accountDomain = null;
            this.state.isAccountDomainLoading = false;
        }
    };

    /**
     * Set the address
     */
    setAddress = (address: string | null): void => {
        this.state.address = address;
    };

    /**
     * Set the address and check for the vechain domain, if present set it as well
     */
    setAddressAndDomain = (address: string | null): void => {
        this.setAddress(address);
        this.setAccountDomain(address);
    };

    /**
     * Sign a connection certificate
     * this is needed for wallet connect connections when a connection certificate is required
     */
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
            this.setAddressAndDomain(signer);
            this.state.connectionCertificate = connectionCertificate;
            return {
                account: signer,
                verified: true,
                connectionCertificate,
            };
        } catch (e) {
            console.error('Failed to sign connection certificate', e);
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
            .then((res) => {
                if (
                    this.state.source === 'wallet-connect' &&
                    this.options.requireCertificate &&
                    this.options.walletConnectOptions?.modal
                        ?.askForConnectionCertificate
                ) {
                    this.options.walletConnectOptions.modal.askForConnectionCertificate();
                } else {
                    this.setAddressAndDomain(res.account);
                    this.state.connectionCertificate =
                        res.connectionCertificate ?? null;
                }
                return res;
            })
            .catch((e) => {
                DAppKitLogger.error('WalletManager', 'connect', e);
                throw e;
            });

    disconnect = (remote = false): void => {
        if (!this.state.source) {
            this.state.source = null;
            this.setAddressAndDomain(null);
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
        this.setAddressAndDomain(null);
        this.state.connectionCertificate = null;
    };

    signTx = (
        msg: Connex.Vendor.TxMessage,
        options: Connex.Signer.TxOptions,
    ): Promise<Connex.Vendor.TxResponse> =>
        this.wallet.signTx(msg, options).catch((e) => {
            DAppKitLogger.error('WalletManager', 'signTx', e);
            throw e;
        });

    signCert = (
        msg: Connex.Vendor.CertMessage,
        options: Connex.Signer.CertOptions,
    ): Promise<Connex.Vendor.CertResponse> =>
        this.wallet.signCert(msg, options).catch((e) => {
            DAppKitLogger.error('WalletManager', 'signCert', e);
            throw e;
        });

    signTypedData = (
        domain: ethers.TypedDataDomain,
        types: Record<string, ethers.TypedDataField[]>,
        value: Record<string, unknown>,
        options?: SignTypedDataOptions,
    ): Promise<string> =>
        this.wallet.signTypedData(domain, types, value, options).catch((e) => {
            DAppKitLogger.error('WalletManager', 'signTypedData', e);
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
                accountDomain: null,
                isAccountDomainLoading: false,
                availableSources,
                connectionCertificate: null,
            });
        }

        const address = Storage.getAccount();
        const accountDomain = Storage.getAccountDomain();
        const source = Storage.getSource();
        const connectionCertificate = Storage.getConnectionCertificate();

        return proxy({
            source,
            address,
            accountDomain,
            isAccountDomainLoading: false,
            availableSources,
            connectionCertificate,
        });
    };

    private initPersistence = (usePersistence: boolean): void => {
        if (!usePersistence) {
            return;
        }
        this.subscribeToKey('address', Storage.setAccount);
        this.subscribeToKey('accountDomain', Storage.setAccountDomain);
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
