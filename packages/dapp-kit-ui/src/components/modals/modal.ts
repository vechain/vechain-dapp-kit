import type { WalletSource } from '@vechain/dapp-kit';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DAppKitUI } from '../../client';
import {
    defaultI18n,
    type I18n,
    type SourceInfo,
    type ThemeMode,
} from '../../constants';
import { subscribeToCustomEvent } from '../../utils';

let dappKitConfiguredListener: () => void;

@customElement('vdk-modal')
export class Modal extends LitElement {
    constructor() {
        super();
        if (DAppKitUI.initialized) {
            this.setAddressFromState();
        }
    }

    connectedCallback(): void {
        super.connectedCallback();
        if (DAppKitUI.initialized) {
            this.initAddressListener();
        }
        dappKitConfiguredListener = subscribeToCustomEvent(
            'vdk-dapp-kit-configured',
            () => {
                this.setAddressFromState();
                this.initAddressListener();
            },
        );
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        dappKitConfiguredListener?.();
    }

    private setAddressFromState(): void {
        this.address = DAppKitUI.wallet.state.address ?? '';
        this.accountDomain = DAppKitUI.wallet.state.accountDomain ?? '';
        this.isAccountDomainLoading = Boolean(
            DAppKitUI.wallet.state.isAccountDomainLoading,
        );
        this.addresses = DAppKitUI.wallet.state.addresses ?? [];
        this.source = DAppKitUI.wallet.state.source;
        this.availableMethods = DAppKitUI.wallet.availableMethods;
        this.requestUpdate();
    }

    private initAddressListener(): void {
        DAppKitUI.wallet.subscribeToKey(
            'address',
            (_address: string | null) => {
                this.address = _address ?? '';
                this.requestUpdate();
            },
        );
        DAppKitUI.wallet.subscribeToKey(
            'accountDomain',
            (_accountDomain: string | null) => {
                this.accountDomain = _accountDomain ?? '';
                this.requestUpdate();
            },
        );
        DAppKitUI.wallet.subscribeToKey(
            'isAccountDomainLoading',
            (_isAccountDomainLoading: boolean) => {
                this.isAccountDomainLoading = _isAccountDomainLoading;
                this.requestUpdate();
            },
        );
        DAppKitUI.wallet.subscribeToKey('addresses', (_addresses: string[]) => {
            this.addresses = [..._addresses];
            this.requestUpdate();
        });
        DAppKitUI.wallet.subscribeToKey(
            'source',
            (_source: WalletSource | null) => {
                this.source = _source;
                this.requestUpdate();
            },
        );
        DAppKitUI.wallet.subscribeToKey(
            'availableMethods',
            (_availableMethods: string[] | null) => {
                this.availableMethods = _availableMethods ?? [];
                this.requestUpdate();
            },
        );
    }

    private get alwaysShowConnect(): boolean {
        return DAppKitUI.configuration?.alwaysShowConnect ?? false;
    }

    @property()
    address = DAppKitUI.wallet.state.address ?? '';

    @property()
    accountDomain = DAppKitUI.wallet.state.accountDomain ?? '';

    @property()
    isAccountDomainLoading = Boolean(
        DAppKitUI.wallet.state.isAccountDomainLoading,
    );

    @property()
    addresses: string[] = DAppKitUI.wallet.state.addresses ?? [];

    @property()
    source: WalletSource | null = DAppKitUI.wallet.state.source;

    @property()
    availableMethods: string[] = DAppKitUI.wallet.availableMethods;

    @property()
    mode: ThemeMode = 'LIGHT';

    @property()
    i18n: I18n = defaultI18n;

    @property()
    language = 'en';

    @property({ type: Function })
    onSourceClick?: (source?: SourceInfo) => void;

    @property({ type: Function })
    onDisconnectClick = (): void => {
        DAppKitUI.wallet.disconnect();
    };

    @property({ type: Function })
    onSwitchWalletClick = (): void => {
        DAppKitUI.wallet.switchWallet().then(() => DAppKitUI.modal.close());
    };

    @property({ type: Function })
    onSelectAccount = (address: string): void => {
        DAppKitUI.wallet.setActiveAccount(address);
        DAppKitUI.modal.close();
    };

    @property({ type: Function })
    onAddAccount = (): void => {
        void DAppKitUI.wallet.requestPermissions();
    };

    @property({ type: Function })
    onRevokeAccount = (address: string): void => {
        void DAppKitUI.wallet.revokeAccount(address);
    };

    override render(): TemplateResult {
        if (!DAppKitUI.initialized) {
            return html``;
        }

        return html`
            <div>
                ${this.address && !this.alwaysShowConnect
                    ? html` <vdk-address-modal
                          .mode=${this.mode}
                          .i18n=${this.i18n}
                          .language=${this.language}
                          .address=${this.address}
                          .accountDomain=${this.accountDomain}
                          .isAccountDomainLoading=${this.isAccountDomainLoading}
                          .addresses=${this.addresses}
                          .source=${this.source ?? ''}
                          .availableMethods=${this.availableMethods}
                          .onDisconnectClick=${this.onDisconnectClick}
                          .onSwitchWalletClick=${this.onSwitchWalletClick}
                          .onSelectAccount=${this.onSelectAccount}
                          .onAddAccount=${this.onAddAccount}
                          .onRevokeAccount=${this.onRevokeAccount}
                      ></vdk-address-modal>`
                    : html` <vdk-connect-modal
                          .mode=${this.mode}
                          .i18n=${this.i18n}
                          .language=${this.language}
                          .onSourceClick=${this.onSourceClick || nothing}
                      ></vdk-connect-modal>`}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vdk-modal': Modal;
    }
}
