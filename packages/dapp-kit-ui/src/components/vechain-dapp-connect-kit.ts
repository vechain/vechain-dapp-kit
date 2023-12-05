import { html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { ThemeMode, I18n } from '../constants';
import { defaultI18n } from '../constants';

@customElement('vwk-vechain-dapp-connect-kit')
export class VechainDappConnectKit extends LitElement {
    @property()
    mode: ThemeMode = 'LIGHT';

    @property()
    i18n: I18n = defaultI18n;

    @property()
    language = 'en';

    render(): TemplateResult {
        return html` <dapp-kit-context-provider>
            <vwk-connect-button-with-modal
                .mode=${this.mode}
                .i18n=${this.i18n}
                .language=${this.language}
            ></vwk-connect-button-with-modal>
        </dapp-kit-context-provider>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vwk-vechain-dapp-connect-kit': VechainDappConnectKit;
    }
}
