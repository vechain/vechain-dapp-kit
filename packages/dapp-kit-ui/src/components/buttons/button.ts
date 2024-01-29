import { html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { subscribeKey } from 'valtio/vanilla/utils';
import { DAppKitUI } from '../../client';
import { defaultI18n, type I18n, type ThemeMode } from '../../constants';
import { subscribeToCustomEvent } from '../../utils';

@customElement('vdk-button')
export class Button extends LitElement {
    constructor() {
        super();
        if (DAppKitUI.initialized) {
            this.address = DAppKitUI.wallet.state.address ?? '';
            this.initAddressListener();
            setTimeout(() => {
                DAppKitUI.configureButtonsAndModals();
                this.requestUpdate();
            }, 0);
        } else {
            subscribeToCustomEvent('vdk-dapp-kit-configured', () => {
                this.address = DAppKitUI.wallet.state.address ?? '';
                this.initAddressListener();
            });
        }
    }

    private initAddressListener(): void {
        subscribeKey(DAppKitUI.wallet.state, 'address', (v) => {
            this.address = v ?? '';
            this.requestUpdate();
        });
    }

    @property()
    mode: ThemeMode = 'LIGHT';

    @property()
    i18n: I18n = defaultI18n;

    @property()
    language = 'en';

    @property()
    address = '';

    override render(): TemplateResult {
        return html`
            ${this.address
                ? html`<vdk-address-button
                      .mode=${this.mode}
                      .address=${this.address}
                  ></vdk-address-button>`
                : html`<vdk-connect-button
                      .mode=${this.mode}
                      .i18n=${this.i18n}
                      .language=${this.language}
                  ></vdk-connect-button>`}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vdk-button': Button;
    }
}
