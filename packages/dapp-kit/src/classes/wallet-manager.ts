import { Certificate } from '@vechain/sdk-core';
import {
    SignTypedDataOptions,
    ThorClient,
    TypedDataDomain,
    TypedDataParameter,
} from '@vechain/sdk-network';
import { proxy, subscribe } from 'valtio/vanilla';
import { subscribeKey } from 'valtio/vanilla/utils';
import { recoverTypedDataAddress } from 'viem';
import { DEFAULT_CONNECT_CERT_MESSAGE, WalletSources } from '../constants';
import type {
    CertificateArgs,
    CertificateMessage,
    CertificateOptions,
    CertificateResponse,
    ConnectResponse,
    ConnectV2Response,
    DAppKitOptions,
    TransactionMessage,
    TransactionOptions,
    TransactionResponse,
    VeChainWallet,
    WalletManagerState,
    WalletSource,
} from '../types';
import { TypedDataMessage } from '../types/types';
import { createWallet, DAppKitLogger, Storage } from '../utils';
import { getAccountDomain } from '../utils/get-account-domain';
import { getPrimaryType } from '../utils/typed-data';

class WalletManager {
    public state: WalletManagerState;
    private wallets: Record<string, VeChainWallet | undefined> = {};

    constructor(
        private readonly options: DAppKitOptions,
        private readonly thor: ThorClient,
    ) {
        if (options.v2Api.enabled) {
            this.state = proxy({
                source: null,
                address: null,
                accountDomain: null,
                isAccountDomainLoading: false,
                availableSources: this.getAvailableSources(),
                connectionCertificate: null,
                availableMethods: [],
            });
            return;
        }
        this.state = this.initializeStateSync(options.usePersistence ?? false);
        this.initPersistence(options.usePersistence ?? false);
        DAppKitLogger.debug('WalletManager', 'constructor', this.state);

        if (window.vechain?.isInAppBrowser === true) {
            this.setSource('veworld');
        } else if (options.useFirstDetectedSource) {
            this.setFirstDetectedSource();
        }
    }

    private get wallet(): VeChainWallet {
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

    get availableMethods(): string[] {
        return this.state.availableMethods ?? [];
    }

    /**
     * Set the account domain
     */
    setAccountDomain = (address: string | null): void => {
        if (address) {
            this.state.isAccountDomainLoading = true;

            getAccountDomain({ address, thor: this.thor })
                .then((domain) => {
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

    connectV2 = async <
        TValue extends null | CertificateMessage | TypedDataMessage,
    >(
        value: TValue,
    ): Promise<ConnectV2Response<TValue>> => {
        if (
            this.state.source === 'veworld' &&
            this.availableMethods.includes('thor_connect')
        ) {
            const result = await this.wallet.connectV2(
                value,
                this.options.v2Api.external,
            );
            await this.populateAvailableMethods();
            if (value === null)
                this.setAddress((result as ConnectV2Response<null>).signer);
            else if ('domain' in value)
                this.setAddress(
                    (result as ConnectV2Response<TypedDataMessage>).signer,
                );
            else
                this.setAddress(
                    (result as ConnectV2Response<CertificateMessage>).annex
                        .signer,
                );
            return result;
        }

        const connection = await this.connect();
        await this.populateAvailableMethods();
        if (value === null) {
            return { signer: connection.account } as ConnectV2Response<TValue>;
        }
        if ('purpose' in value) {
            const cert = await this.signCert(value as any, {});
            return cert as any;
        }
        const typedMessage = value as TypedDataMessage;
        const res = await this.signTypedData(
            typedMessage.domain,
            typedMessage.types,
            typedMessage.value,
        );
        const signer = await recoverTypedDataAddress({
            signature: res as `0x${string}`,
            message: typedMessage.value,
            domain: typedMessage.domain,
            types: typedMessage.types,
            primaryType: getPrimaryType(typedMessage.types),
        });
        return { signer, signature: res } as any;
    };

    switchWallet = async (): Promise<void> => {
        try {
            if (this.state.source === 'veworld') {
                const newWallet = await this.wallet.switchWallet();
                if (!newWallet) return;
                this.state.address = newWallet;
            }
        } catch {}
    };

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

    signTx = async (
        msg: TransactionMessage[],
        options: TransactionOptions = {},
    ): Promise<TransactionResponse> => {
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
        this.populateAvailableMethods();
    };

    subscribe = (
        listener: (state: WalletManagerState) => void,
    ): (() => void) => {
        return subscribe(this.state, () => {
            if (!this.state) return;
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
        if (!this.options.v2Api.enabled)
            throw new Error(
                `This method should only be called if 'supportNewMethods' options is active`,
            );
        const availableSources = this.getAvailableSources();
        this.initPersistence(this.options.usePersistence ?? false);

        Storage.wipeV1();
        let source = Storage.getSource();
        DAppKitLogger.debug(
            'WalletManager',
            'initializeStateAsync',
            'source',
            source,
        );
        if (
            source !== null &&
            source !== 'veworld' &&
            this.options.usePersistence
        ) {
            this.initFromPersistentStore({ source, availableSources });
            return;
        }

        if (window.vechain?.isInAppBrowser === true) {
            source = 'veworld';
        } else if (this.options.useFirstDetectedSource) {
            source = this.getFirstDetectedSource();
        }

        DAppKitLogger.debug(
            'WalletManager',
            'initializeStateAsync',
            'detected source',
            source,
        );
        if (!source) return;
        if (source !== 'veworld') {
            this.state.source = source;
            return;
        }
        const opts = {
            ...this.options,
            source,
            onDisconnected: () => this.disconnect(true),
            thor: this.thor,
        };
        const wallet = createWallet(opts);
        DAppKitLogger.debug(
            'WalletManager',
            'initializeStateAsync',
            'wallet created',
            wallet,
        );
        const methods = await wallet.getAvailableMethods();
        DAppKitLogger.debug(
            'WalletManager',
            'initializeStateAsync',
            'available methods',
            methods,
        );
        if (!methods || methods.length === 0) {
            if (this.options.usePersistence)
                return this.initFromPersistentStore({
                    source,
                    availableSources,
                });
            DAppKitLogger.debug(
                'WalletManager',
                'initializeStateAsync',
                'Current version of VeWorld does not support the method',
            );
            this.state.source = source;
            return;
        }
        const address = await wallet.getAddress();
        DAppKitLogger.debug(
            'WalletManager',
            'initializeStateAsync',
            'address retrieved',
            address,
        );
        if (!address) {
            DAppKitLogger.debug(
                'WalletManager',
                'initializeStateAsync',
                'Current version of VeWorld either does not support the method or user has no session.',
            );
            this.state.source = source;
            this.state.availableSources = availableSources;
            this.state.availableMethods = methods;
            return;
        }

        this.state.source = source;
        this.state.address = address;
        this.state.availableSources = availableSources;
        this.state.availableMethods = methods;
    };

    private initFromPersistentStore = ({
        source,
        availableSources,
    }: {
        source: WalletSource | null;
        availableSources: WalletSource[];
    }): void => {
        DAppKitLogger.debug('WalletManager', 'initFromPersistentStore');
        const address = Storage.getAccount();
        const accountDomain = Storage.getAccountDomain();
        const connectionCertificate = Storage.getConnectionCertificate();
        this.state.source = source;
        this.state.address = address;
        this.state.accountDomain = accountDomain;
        this.state.isAccountDomainLoading = false;
        this.state.availableSources = availableSources;
        this.state.connectionCertificate = connectionCertificate;
        this.state.availableMethods = [];
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

    getAddress = async (): Promise<string | null> => {
        if (this.state.source === null) return null;
        switch (this.state.source) {
            case 'wallet-connect':
            case 'veworld':
                return this.wallet.getAddress();
            case 'sync':
            case 'sync2':
                return this.state.address;
        }
    };

    populateAvailableMethods = async (): Promise<void> => {
        try {
            this.state.availableMethods =
                (await this.wallet.getAvailableMethods()) ?? [];
        } catch {
            this.state.availableMethods = [];
        }
    };
}

export { WalletManager };
