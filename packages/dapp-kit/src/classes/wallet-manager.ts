import { Certificate } from '@vechain/sdk-core';
import {
    type SignTypedDataOptions,
    ThorClient,
    type TypedDataDomain,
    type TypedDataParameter,
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
    NormalizedDAppKitOptions,
    TransactionMessage,
    TransactionOptions,
    TransactionResponse,
    VeChainWallet,
    WalletManagerState,
    WalletSource,
} from '../types';
import type { TypedDataMessage } from '../types/types';
import { createWallet, DAppKitLogger, Storage } from '../utils';
import {
    getAccountDomain,
    getAccountDomains,
} from '../utils/get-account-domain';
import { getPrimaryType, parseChainId } from '../utils/typed-data';

class WalletManager {
    public state: WalletManagerState;
    private wallets: Record<string, VeChainWallet | undefined> = {};

    constructor(
        private readonly options: NormalizedDAppKitOptions,
        private readonly thor: ThorClient,
    ) {
        if (options.v2Api.enabled) {
            this.state = proxy({
                source: null,
                address: null,
                addresses: [],
                accountDomain: null,
                accountDomains: {},
                isAccountDomainLoading: false,
                availableSources: this.getAvailableSources(),
                connectionCertificate: null,
                availableMethods: [],
            });
            return;
        }
        this.state = this.initializeStateSync(options.usePersistence ?? false);
        this.initPersistence(options.usePersistence ?? false);
        void this.resolveAccountDomains(this.state.addresses);
        DAppKitLogger.debug('WalletManager', 'constructor', this.state);

        if (window.vechain?.isInAppBrowser === true) {
            this.setSource('veworld');
        } else if (options.useFirstDetectedSource) {
            this.setFirstDetectedSource();
        }
    }

    private async getWallet(): Promise<VeChainWallet> {
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
            wallet = await createWallet(opts);

            this.wallets[source] = wallet;
        }

        return wallet;
    }

    private async withWallet<TResult>(cb: (w: VeChainWallet) => TResult) {
        const wallet = await this.getWallet();
        return cb(wallet);
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
                    this.state.accountDomains = {
                        ...this.state.accountDomains,
                        [address.toLowerCase()]: domain,
                    };
                })
                .catch((e) => {
                    console.error('Error getting account domain', e);
                    if (!this.state) return;
                    this.state.accountDomain = null;
                    this.state.accountDomains = {
                        ...this.state.accountDomains,
                        [address.toLowerCase()]: null,
                    };
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
     * Set the full set of approved addresses. The first entry is treated as
     * the primary (active) signer when populated by v2 `thor_connect`.
     */
    setAddresses = (addresses: string[]): void => {
        const previousDomains = this.state.accountDomains;
        const missingAddresses: string[] = [];
        const accountDomains = addresses.reduce<Record<string, string | null>>(
            (acc, address) => {
                const key = address.toLowerCase();
                if (
                    Object.prototype.hasOwnProperty.call(
                        previousDomains,
                        key,
                    ) &&
                    previousDomains[key] !== null
                ) {
                    acc[key] = previousDomains[key];
                } else {
                    acc[key] = null;
                    missingAddresses.push(address);
                }
                return acc;
            },
            {},
        );

        this.state.addresses = addresses;
        this.state.accountDomains = accountDomains;
        void this.resolveAccountDomains(missingAddresses);
    };

    private resolveAccountDomains = async (
        addresses: string[],
    ): Promise<void> => {
        if (addresses.length === 0) return;

        try {
            const domains = await getAccountDomains({
                addresses,
                thor: this.thor,
            });
            const currentAddressKeys = new Set(
                this.state.addresses.map((address) => address.toLowerCase()),
            );
            const accountDomains = { ...this.state.accountDomains };

            for (const [address, domain] of Object.entries(domains)) {
                const key = address.toLowerCase();
                if (currentAddressKeys.has(key)) {
                    accountDomains[key] = domain;
                }
            }

            this.state.accountDomains = accountDomains;

            const activeAddress = this.state.address?.toLowerCase();
            if (activeAddress && activeAddress in accountDomains) {
                this.state.accountDomain = accountDomains[activeAddress];
            }
        } catch (e) {
            DAppKitLogger.warn('WalletManager', 'resolveAccountDomains', e);
        }
    };

    /**
     * Switch the active address to one already present in `state.addresses`
     * WITHOUT reopening the wallet picker (cf. `switchWallet`). Throws if the
     * given address has not been approved by the user in this session.
     */
    setActiveAccount = (address: string): void => {
        const lower = address.toLowerCase();
        const match = this.state.addresses.find(
            (a) => a.toLowerCase() === lower,
        );
        if (!match) {
            throw new Error(
                `setActiveAccount: address ${address} is not in the approved list`,
            );
        }
        this.setAddress(match);
        this.setAccountDomain(match);
    };

    /**
     * Set the address and check for the vechain domain, if present set it as well
     */
    setAddressAndDomain = (address: string | null): void => {
        this.setAddress(address);
        this.setAccountDomain(address);
    };

    private recoverTypedDataSigner = async (
        signature: string,
        domain: TypedDataDomain,
        types: Record<string, TypedDataParameter[]>,
        message: Record<string, unknown>,
    ): Promise<string> =>
        recoverTypedDataAddress({
            signature: signature as `0x${string}`,
            message,
            domain: {
                ...domain,
                chainId: parseChainId(
                    domain.chainId as TypedDataMessage['domain']['chainId'],
                ),
            },
            types,
            primaryType: getPrimaryType(types),
        });

    private getTypedDataOptions = (
        options: SignTypedDataOptions,
    ): SignTypedDataOptions => {
        const signer = options.signer ?? this.state.address ?? undefined;
        return signer ? { ...options, signer } : options;
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
        } = await this.withWallet((wallet) =>
            wallet.signCert(certificateMessage, certificateOptions),
        );

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
            const res = await this.withWallet((wallet) =>
                wallet.connect(_certificate),
            );
            if (
                this.state.source === 'wallet-connect' &&
                this.options.requireCertificate &&
                this.options.walletConnectOptions?.modal
                    ?.askForConnectionCertificate
            ) {
                this.options.walletConnectOptions.modal.askForConnectionCertificate();
            } else {
                this.setAddressAndDomain(res.account);
                this.setAddresses(res.account ? [res.account] : []);
                this.state.connectionCertificate =
                    res.connectionCertificate ?? null;
                // Successful wallet-connect connection without a required
                // certificate: close the QR + wallet modal explicitly. The
                // wallet manager doesn't otherwise close it (the dapp-kit-ui
                // connect-modal only auto-swaps to the address modal when
                // `alwaysShowConnect` is false), so without this the source
                // list stays visible after approval on the wallet.
                if (this.state.source === 'wallet-connect') {
                    this.options.walletConnectOptions?.modal?.onConnected?.();
                }
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
        // `setSource('veworld')` triggers `populateAvailableMethods()` in a
        // fire-and-forget fashion, so a `connectV2` call that immediately
        // follows `setSource` would see an empty `availableMethods` and fall
        // back to the legacy certificate-based `connect()`. Re-populate
        // synchronously when needed so the V2 path is taken whenever the
        // installed extension actually supports it.
        if (
            this.state.source === 'veworld' &&
            this.availableMethods.length === 0
        ) {
            await this.populateAvailableMethods();
        }

        if (
            this.state.source === 'veworld' &&
            this.availableMethods.includes('thor_connect')
        ) {
            const result = await this.withWallet((wallet) =>
                wallet.connectV2(value, this.options.v2Api.external),
            );
            await this.populateAvailableMethods();

            let primary: string;
            if (value === null) {
                primary = (result as ConnectV2Response<null>).signer;
            } else if ('domain' in value) {
                primary = (result as ConnectV2Response<TypedDataMessage>)
                    .signer;
            } else {
                primary = (result as ConnectV2Response<CertificateMessage>)
                    .annex.signer;
            }

            this.setAddressAndDomain(primary);
            const accountsFromWallet = (result as { accounts?: string[] })
                .accounts;
            this.setAddresses(
                accountsFromWallet && accountsFromWallet.length > 0
                    ? accountsFromWallet
                    : primary
                      ? [primary]
                      : [],
            );
            return result;
        }

        if (this.state.source === 'veworld' && this.options.v2Api.enabled) {
            throw new Error('VeWorld v2 API is not available');
        }

        const connection = await this.connect();
        await this.populateAvailableMethods();
        if (value === null) {
            this.setAddresses(connection.account ? [connection.account] : []);
            return { signer: connection.account } as ConnectV2Response<TValue>;
        }
        if ('purpose' in value) {
            const cert = await this.signCert(value as any, {});
            this.setAddresses(cert.annex.signer ? [cert.annex.signer] : []);
            return cert as any;
        }
        const typedMessage = value as TypedDataMessage;
        const res = await this.signTypedData(
            typedMessage.domain,
            typedMessage.types,
            typedMessage.value,
        );
        const signer = await this.recoverTypedDataSigner(
            res,
            typedMessage.domain,
            typedMessage.types,
            typedMessage.value,
        );
        this.setAddresses(signer ? [signer] : []);
        return { signer, signature: res } as any;
    };

    /**
     * Ask the wallet to (re-)display its account approval picker so the
     * user can approve additional accounts without first disconnecting.
     * Uses EIP-2255 `wallet_requestPermissions` when the connected wallet
     * advertises it (VeWorld v2). Updates `state.addresses` (and
     * `state.address` if it was unset) with the new approved set.
     */
    requestPermissions = async (): Promise<string[]> => {
        // Only VeWorld v2 advertises EIP-2255 permissions. For any other
        // source (or older VeWorld builds), short-circuit and return what we
        // already know so callers don't have to special-case it.
        if (
            this.state.source !== 'veworld' ||
            !this.availableMethods.includes('wallet_requestPermissions')
        ) {
            DAppKitLogger.warn(
                'WalletManager',
                'requestPermissions',
                'wallet does not advertise wallet_requestPermissions',
            );
            return this.state.addresses;
        }
        try {
            const wallet = await this.getWallet();
            // Double-check at the wallet instance level: `availableMethods`
            // is wallet-advertised metadata, but the adapter could still lack
            // the implementation (e.g. legacy `CertificateBasedWallet` built
            // without a `walletProvider`). Bail out silently in that case.
            if (typeof wallet.requestPermissions !== 'function') {
                return this.state.addresses;
            }
            // Opens VeWorld's account picker. Returns the FULL new approved
            // set (not just the delta), so we can replace `state.addresses`
            // wholesale instead of merging.
            const next = await wallet.requestPermissions();
            if (!Array.isArray(next)) return this.state.addresses;
            this.setAddresses(next);
            // The user may have unchecked the previously-active account in
            // the picker. Detect that case (case-insensitive: VeWorld may
            // return checksummed addresses while we stored lowercase, or
            // vice-versa) and promote `next[0]` as the new active signer so
            // the dApp doesn't end up holding an `address` that is no longer
            // authorized. Domain is re-resolved because it depends on which
            // account is active.
            const activeStillApproved =
                !!this.state.address &&
                next.some(
                    (address) =>
                        address.toLowerCase() ===
                        this.state.address?.toLowerCase(),
                );
            if (next.length > 0 && !activeStillApproved) {
                this.setAddress(next[0]);
                this.setAccountDomain(next[0]);
            }
            return next;
        } catch (e) {
            // Swallow and return the existing approved set. Common causes:
            // user dismissed the VeWorld picker (USER_REJECTED) or the
            // extension threw because the dApp isn't connected yet. Callers
            // get back a valid array either way and can compare lengths to
            // detect "nothing changed".
            DAppKitLogger.error('WalletManager', 'requestPermissions', e);
            return this.state.addresses;
        }
    };

    revokeAccount = async (address: string): Promise<string[]> => {
        if (
            this.state.source !== 'veworld' ||
            !this.availableMethods.includes('wallet_revokeAccountPermission')
        ) {
            DAppKitLogger.warn(
                'WalletManager',
                'revokeAccount',
                'wallet does not advertise wallet_revokeAccountPermission',
            );
            return this.state.addresses;
        }
        try {
            const wallet = await this.getWallet();
            if (typeof wallet.revokeAccount !== 'function') {
                return this.state.addresses;
            }
            await wallet.revokeAccount(address);
            const lower = address.toLowerCase();
            const next = this.state.addresses.filter(
                (account) => account.toLowerCase() !== lower,
            );
            this.setAddresses(next);

            const activeWasRevoked =
                this.state.address?.toLowerCase() === lower;
            if (activeWasRevoked) {
                if (next.length > 0) {
                    this.setAddress(next[0]);
                    this.setAccountDomain(next[0]);
                } else {
                    this.disconnect(true);
                }
            }
            return next;
        } catch (e) {
            DAppKitLogger.error('WalletManager', 'revokeAccount', e);
            return this.state.addresses;
        }
    };

    switchWallet = async (): Promise<void> => {
        try {
            if (this.state.source === 'veworld') {
                const newWallet = await this.withWallet((wallet) =>
                    wallet.switchWallet(),
                );
                if (!newWallet) return;
                this.setAddressAndDomain(newWallet);
                // Make sure the newly-active address is reflected in the
                // approved set. Mobile `thor_switchWallet` returns a single
                // address, so we don't know if other approved accounts were
                // revoked — promoting it to head of list while preserving
                // existing entries is the conservative choice.
                const lower = newWallet.toLowerCase();
                const existing = this.state.addresses.filter(
                    (a) => a.toLowerCase() !== lower,
                );
                this.setAddresses([newWallet, ...existing]);
            }
        } catch {}
    };

    disconnect = (remote = false): void => {
        if (!this.state.source) {
            this.state.source = null;
            this.setAddressAndDomain(null);
            this.setAddresses([]);
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
        this.setAddresses([]);
        this.state.connectionCertificate = null;
    };

    /**
     * Best-effort silent re-fetch of the approved accounts list after a sign
     * operation on the VeWorld desktop extension. When the user authorizes
     * additional accounts via the extension's permission prompt at sign
     * time, the wallet returns only the signer in the sign response —
     * `state.addresses` stays stale unless we round-trip through
     * `thor_connect`, which on the v2 EIP-1193 adapter resolves to
     * `eth_requestAccounts` (EIP-1102, silent when already authorized).
     *
     * Restricted to the desktop extension (detected via
     * `window.vechain.request`) because veworld-mobile's in-app browser
     * exposes a Connex-style `send` channel where `thor_connect` with
     * `value: null` is interpreted as a fresh connect intent and re-opens
     * the account picker.
     *
     * Failures are non-fatal: the sign result is already returned to the
     * caller and any error here is logged only.
     */
    private refreshApprovedAccounts = async (): Promise<void> => {
        if (
            this.state.source !== 'veworld' ||
            !this.availableMethods.includes('thor_connect')
        )
            return;
        const ext = (typeof window !== 'undefined' ? window.vechain : null) as
            | (Window['vechain'] & {
                  request?: unknown;
                  isInAppBrowser?: boolean;
              })
            | null;
        if (!ext || ext.isInAppBrowser || typeof ext.request !== 'function')
            return;
        try {
            const wallet = await this.getWallet();
            if (!wallet || typeof wallet.connectV2 !== 'function') return;
            const res = await wallet.connectV2(
                null,
                this.options.v2Api?.external,
            );
            if (
                res &&
                Array.isArray((res as { accounts?: unknown }).accounts)
            ) {
                const accounts = (res as { accounts: string[] }).accounts;
                if (accounts.length > 0) {
                    this.setAddresses(accounts);
                    const current = this.state.address;
                    if (
                        current &&
                        !accounts.some(
                            (a) => a.toLowerCase() === current.toLowerCase(),
                        )
                    ) {
                        this.setAddress(accounts[0]);
                        this.setAccountDomain(accounts[0]);
                    }
                }
            }
        } catch (e) {
            DAppKitLogger.warn('WalletManager', 'refreshApprovedAccounts', e);
        }
    };

    signTx = async (
        msg: TransactionMessage[],
        options: TransactionOptions = {},
    ): Promise<TransactionResponse> => {
        try {
            const res = await this.withWallet((wallet) =>
                wallet.signTx(msg, options),
            );
            this.setAddressAndDomain(res.signer);
            void this.refreshApprovedAccounts();
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
            const res = await this.withWallet((wallet) =>
                wallet.signCert(msg, options),
            );
            // TODO: we should probably remove these assignment, because the user should be already logged in, and the address should be already defined, test it after e2e with transactions
            this.setAddressAndDomain(res.annex.signer);
            void this.refreshApprovedAccounts();
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
        options: SignTypedDataOptions = {},
    ): Promise<string> => {
        const wallet = await this.getWallet();
        if (!wallet.signTypedData)
            throw new Error('signTypedData is not supported');

        try {
            const typedDataOptions = this.getTypedDataOptions(options);
            const res = await wallet.signTypedData(
                domain,
                types,
                message,
                typedDataOptions,
            );
            try {
                const signer = await this.recoverTypedDataSigner(
                    res,
                    domain,
                    types,
                    message,
                );
                this.setAddressAndDomain(signer);
            } catch (e) {
                DAppKitLogger.warn(
                    'WalletManager',
                    'signTypedData recover signer',
                    e,
                );
            }
            void this.refreshApprovedAccounts();
            return res;
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
                addresses: [],
                accountDomain: null,
                accountDomains: {},
                isAccountDomainLoading: false,
                availableSources,
                connectionCertificate: null,
                availableMethods: [],
            });
        }

        Storage.wipeV1();
        const address = Storage.getAccount();
        const addresses = Storage.getAccounts();
        const accountDomain = Storage.getAccountDomain();
        const source = Storage.getSource();
        const connectionCertificate = Storage.getConnectionCertificate();

        return proxy({
            source,
            address,
            addresses,
            accountDomain,
            accountDomains:
                address && accountDomain
                    ? { [address.toLowerCase()]: accountDomain }
                    : {},
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
        const wallet = await createWallet(opts);
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
        this.state.availableMethods = methods ?? [];
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
        this.state.source = source;
        this.state.availableSources = availableSources;
        const address = await wallet.getAddress();
        DAppKitLogger.debug(
            'WalletManager',
            'initializeStateAsync',
            'address retrieved',
            address,
        );

        // The v2 adapter intentionally returns `null` for `thor_wallet` /
        // `thor_switchWallet` (VeWorld has no silent way to read the active
        // address). Fall back to the persisted account so a page refresh
        // doesn't drop the connection.
        const effectiveAddress =
            address ??
            (this.options.usePersistence ? Storage.getAccount() : null);
        if (!effectiveAddress) return;
        this.state.address = effectiveAddress;
        const persistedAddresses = this.options.usePersistence
            ? Storage.getAccounts()
            : [];
        this.setAddresses(
            persistedAddresses.length > 0
                ? persistedAddresses
                : [effectiveAddress],
        );
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
        const addresses = Storage.getAccounts();
        const accountDomain = Storage.getAccountDomain();
        const connectionCertificate = Storage.getConnectionCertificate();
        this.state.source = source;
        this.state.address = address;
        this.state.accountDomain = accountDomain;
        this.state.accountDomains =
            address && accountDomain
                ? { [address.toLowerCase()]: accountDomain }
                : {};
        this.setAddresses(addresses);
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
        this.subscribeToKey('addresses', Storage.setAccounts);
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
            case 'veworld':
                if (this.availableMethods.includes('thor_wallet'))
                    return this.withWallet((wallet) => wallet.getAddress());
            case 'wallet-connect':
            case 'sync':
            case 'sync2':
                return this.state.address;
        }
    };

    populateAvailableMethods = async (): Promise<void> => {
        try {
            this.state.availableMethods =
                (await this.withWallet((wallet) =>
                    wallet.getAvailableMethods(),
                )) ?? [];
        } catch {
            this.state.availableMethods = [];
        }
    };
}

export { WalletManager };
