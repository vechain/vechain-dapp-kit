import { html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DAppKitUI } from '../../client';
import { defaultI18n, type I18n, type ThemeMode } from '../../constants';
import { subscribeToCustomEvent } from '../../utils';

let dappKitConfiguredListener: () => void;

@customElement('vdk-button')
export class Button extends LitElement {
    constructor() {
        super();
        if (DAppKitUI.initialized) {
            this.configureButtonUI();
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

    private configureButtonUI(): void {
        this.mode = DAppKitUI.configuration?.themeMode ?? 'LIGHT';
        this.i18n = DAppKitUI.configuration?.i18n ?? defaultI18n;
        this.language = DAppKitUI.configuration?.language ?? 'en';
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
    mode: ThemeMode = 'LIGHT';

    @property()
    i18n: I18n = defaultI18n;

    @property()
    language = 'en';

    @property()
    address = '';

    @property()
    accountDomain = '';

    @property()
    isAccountDomainLoading = false;

    @property()
    disabled = false;

    @property()
    mobile = false;

    override render(): TemplateResult {
        return this.address
            ? html`<vdk-address-button
                  .mode=${this.mode}
                  .address=${this.address}
                  .accountDomain=${this.accountDomain}
                  .isAccountDomainLoading=${this.isAccountDomainLoading}
                  .disabled=${this.disabled}
                  .mobile=${this.mobile}
              ></vdk-address-button>`
            : html`<vdk-connect-button
                  .mode=${this.mode}
                  .i18n=${this.i18n}
                  .language=${this.language}
                  .disabled=${this.disabled}
                  .mobile=${this.mobile}
              ></vdk-connect-button>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vdk-button': Button;
    }
}
