import { html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { defaultI18n, type I18n, type ThemeMode } from '../constants';

@customElement('vwk-connected-address-button-with-modal')
export class AddressButtonWithModal extends LitElement {
    @property()
    mode: ThemeMode = 'LIGHT';

    @property()
    i18n: I18n = defaultI18n;

    @property()
    language = 'en';

    @property({ type: String })
    address?: string;

    @property({ type: Function })
    onDisconnectClick?: () => void = undefined;

    override render(): TemplateResult {
        return html`
            <div>
                <vwk-fonts></vwk-fonts>
                <vwk-connected-address-button
                    .mode=${this.mode}
                    .address=${this.address}
                ></vwk-connected-address-button>
                <vwk-connected-address-modal
                    .mode=${this.mode}
                    .i18n=${this.i18n}
                    .language=${this.language}
                    .address=${this.address}
                    .onDisconnectClick=${this.onDisconnectClick}
                ></vwk-connected-address-modal>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vwk-connected-address-button-with-modal': AddressButtonWithModal;
    }
}
