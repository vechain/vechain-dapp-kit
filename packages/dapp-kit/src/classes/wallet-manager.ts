import { Certificate } from '@vechain/sdk-core';
import {
    SignTypedDataOptions,
    ThorClient,
    TypedDataDomain,
    TypedDataParameter,
} from '@vechain/sdk-network';
import { proxy, subscribe } from 'valtio/vanilla';
import { subscribeKey } from 'valtio/vanilla/utils';
import { DEFAULT_CONNECT_CERT_MESSAGE, WalletSources } from '../constants';
import type {
    CertificateArgs,
    CertificateMessage,
    CertificateOptions,
    CertificateResponse,
    ConnectResponse,
    DAppKitOptions,
    TransactionMessage,
    TransactionOptions,
    TransactionResponse,
    VeChainWallet,
    WalletManagerState,
    WalletSource,
} from '../types';
import { createWallet, DAppKitLogger, Storage } from '../utils';
import { getAccountDomain } from '../utils/get-account-domain';

function assertState(
    state: WalletManagerState | undefined,
    fnName: string,
): asserts state is WalletManagerState {
    if (typeof state === 'undefined') {
        DAppKitLogger.error(
            'WalletManager',
            fnName,
            'State has not been initialized. Call DAppKit.initialize() to do so.',
        );
        throw new Error(
            'State has not been initialized. Call DAppKit.initialize() to do so.',
        );
    }
}

const buildState = (state: Partial<WalletManagerState>) =>
    proxy({
        source: null,
        address: null,
        accountDomain: null,
        isAccountDomainLoading: false,
        availableSources: [],
        connectionCertificate: null,
        availableMethods: [],
        ...state,
    });

class WalletManager {
    public state: WalletManagerState | undefined;
    private wallets: Record<string, VeChainWallet | undefined> = {};
    private initialized: boolean = false;

    constructor(
        private readonly options: DAppKitOptions,
        private readonly thor: ThorClient,
    ) {
        if (options.supportNewMethods) return;
        this.state = this.initializeStateSync(options.usePersistence ?? false);
        this.initPersistence(options.usePersistence ?? false);
        DAppKitLogger.debug('WalletManager', 'constructor', this.state);

        if (window.vechain?.isInAppBrowser === true) {
            this.setSource('veworld');
        } else if (options.useFirstDetectedSource) {
            this.setFirstDetectedSource();
        }
        this.initialized = true;
    }

    private get wallet(): VeChainWallet {
        assertState(this.state, 'get wallet');
        const source = this.state.source;

        DAppKitLogger.debug(
            'WalletManager',
            'get wallet',
            'current source',
            source,
        );

        if (!source) {
            throw new Error('No wallet selected');
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
                thor: this.thor,
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
        assertState(this.state, 'setAccountDomain');
        if (address) {
            this.state.isAccountDomainLoading = true;

            getAccountDomain({ address, thor: this.thor })
                .then((domain) => {
                    assertState(this.state, 'getAccountDomain');
                    this.state.accountDomain = domain;
                })
                .catch((e) => {
                    console.error('Error getting account domain', e);
                    if (!this.state) return;
                    this.state.accountDomain = null;
                })
                .finally(() => {
                    if (!this.state) return;
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
        assertState(this.state, 'setAddress');
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
    signConnectionCertificate = async (
        _certificate?: CertificateArgs,
    ): Promise<ConnectResponse> => {
        assertState(this.state, 'signConnectionCertificate');
        const certificateMessage =
            _certificate?.message ||
            this.options.connectionCertificate?.message ||
            DEFAULT_CONNECT_CERT_MESSAGE;
        const certificateOptions =
            _certificate?.options ||
            this.options.connectionCertificate?.options ||
            {};
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
            Certificate.of(connectionCertificate).verify();
            this.state.address = signer;
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

    connect = async (
        _certificate?: CertificateArgs,
    ): Promise<ConnectResponse> => {
        assertState(this.state, 'connect');
        try {
            const res = await this.wallet.connect(_certificate);
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
        } catch (e) {
            DAppKitLogger.error('WalletManager', 'connect', e);
            throw e;
        }
    };

    disconnect = (remote = false): void => {
        assertState(this.state, 'disconnect');
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

    signTx = async (
        msg: TransactionMessage[],
        options: TransactionOptions = {},
    ): Promise<TransactionResponse> => {
        assertState(this.state, 'signTx');
        try {
            const res = await this.wallet.signTx(msg, options);
            this.state.address = res.signer;
            return res;
        } catch (e) {
            DAppKitLogger.error('WalletManager', 'signTx', e);
            throw e;
        }
    };

    signCert = async (
        msg: CertificateMessage,
        options: CertificateOptions = {},
    ): Promise<CertificateResponse> => {
        assertState(this.state, 'signCert');
        try {
            const res = await this.wallet.signCert(msg, options);
            // TODO: we should probably remove these assignment, because the user should be already logged in, and the address should be already defined, test it after e2e with transactions
            this.state.address = res.annex.signer;
            return res;
        } catch (e) {
            DAppKitLogger.error('WalletManager', 'signCert', e);
            throw e;
        }
    };

    signTypedData = async (
        domain: TypedDataDomain,
        types: Record<string, TypedDataParameter[]>,
        message: Record<string, unknown>,
        options?: SignTypedDataOptions,
    ): Promise<string> => {
        if (!this.wallet.signTypedData)
            throw new Error('signTypedData is not supported');

        assertState(this.state, 'signTypedData');
        try {
            return await this.wallet.signTypedData(
                domain,
                types,
                message,
                options,
            );
        } catch (e) {
            DAppKitLogger.error('WalletManager', 'signTypedData', e);
            throw e;
        }
    };

    setSource = (src: WalletSource): void => {
        assertState(this.state, 'setSource');
        if (this.state.source === src) {
            return;
        }

        if (src === 'wallet-connect' && !this.options.walletConnectOptions) {
            throw new Error('WalletConnect options are not provided');
        }

        if (src === 'veworld' && !window.vechain) {
            throw new Error('VeWorld Extension is not installed');
        }

        DAppKitLogger.debug('WalletManager', 'setSource', src);

        this.disconnect();
        this.state.source = src;
    };

    subscribe = (
        listener: (state: WalletManagerState) => void,
    ): (() => void) => {
        assertState(this.state, 'subscribe');
        return subscribe(this.state, () => {
            if (!this.state) return;
            listener(this.state);
        });
    };

    subscribeToKey = <T extends keyof WalletManagerState>(
        key: T,
        listener: (value: WalletManagerState[T]) => void,
    ): (() => void) => {
        assertState(this.state, 'subscribeToKey');
        return subscribeKey(this.state, key, (value) => {
            listener(value);
        });
    };

    private initializeStateSync = (
        usePersistent: boolean,
    ): WalletManagerState => {
        const availableSources = this.getAvailableSources();

        if (!usePersistent) {
            return proxy({
                source: null,
                address: null,
                accountDomain: null,
                isAccountDomainLoading: false,
                availableSources,
                connectionCertificate: null,
                availableMethods: [],
            });
        }

        Storage.wipeV1();
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
            availableMethods: [],
        });
    };

    initializeStateAsync = async (): Promise<void> => {
        if (!this.options.supportNewMethods)
            throw new Error(
                `This method should only be called if 'supportNewMethods' options is active`,
            );
        const availableSources = this.getAvailableSources();

        Storage.wipeV1();
        let source = Storage.getSource();
        if (source !== null && source !== 'veworld') {
            const address = Storage.getAccount();
            const accountDomain = Storage.getAccountDomain();
            const connectionCertificate = Storage.getConnectionCertificate();
            this.state = proxy({
                source,
                address,
                accountDomain,
                isAccountDomainLoading: false,
                availableSources,
                connectionCertificate,
                availableMethods: [],
            });
            return;
        }

        if (window.vechain?.isInAppBrowser === true) {
            source = 'veworld';
        } else if (this.options.useFirstDetectedSource) {
            source = this.getFirstDetectedSource();
        }

        //TODO: This shouldn't happen btw
        if (!source) throw new Error('No source found');
        if (source !== 'veworld') {
            this.state = buildState({ source, availableSources });
            return;
        }
        const opts = {
            ...this.options,
            source,
            onDisconnected: () => this.disconnect(true),
            thor: this.thor,
        };
        const wallet = createWallet(opts);
        const methods = await wallet.getAvailableMethods();
        if (!methods || methods.length === 0) {
            DAppKitLogger.debug(
                'WalletManager',
                'initializeStateAsync',
                'Current version of VeWorld does not support the method',
            );
            this.state = buildState({ source, availableSources });
            return;
        }
        const address = await wallet.getAddress();
        if (!address) {
            DAppKitLogger.debug(
                'WalletManager',
                'initializeStateAsync',
                'Current version of VeWorld either does not support the method or user has no session.',
            );
            this.state = buildState({
                source,
                availableSources,
                availableMethods: methods,
            });
            return;
        }
        this.state = buildState({
            source,
            address,
            availableSources,
            availableMethods: methods,
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
        const defaultAllowedSources = WalletSources;
        const allowedSources =
            this.options.allowedWallets ?? defaultAllowedSources;
        const wallets: WalletSource[] = [];

        if (allowedSources.includes('veworld')) {
            wallets.push('veworld');
        }

        if (
            this.options.walletConnectOptions &&
            allowedSources.includes('wallet-connect')
        ) {
            wallets.push('wallet-connect');
        }

        if (allowedSources.includes('sync2')) {
            wallets.push('sync2');
        }

        if (window.connex && allowedSources.includes('sync')) {
            wallets.push('sync');
        }

        return wallets;
    };

    private getFirstDetectedSource = (): WalletSource => {
        if (window.vechain) {
            return 'veworld';
        } else if (this.options.walletConnectOptions) {
            return 'wallet-connect';
        } else if (window.connex) {
            return 'sync';
        } else {
            return 'sync2';
        }
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
