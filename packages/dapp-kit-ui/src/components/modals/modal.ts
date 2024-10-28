import { html, LitElement, type TemplateResult, nothing } from 'lit';
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

    override render(): TemplateResult {
        if (!DAppKitUI.initialized) {
            return html``;
        }

        return html`
            <div>
                ${this.address
                    ? html` <vdk-address-modal
                          .mode=${this.mode}
                          .i18n=${this.i18n}
                          .language=${this.language}
                          .address=${this.address}
                          .accountDomain=${this.accountDomain}
                          .isAccountDomainLoading=${this.isAccountDomainLoading}
                          .onDisconnectClick=${this.onDisconnectClick}
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
