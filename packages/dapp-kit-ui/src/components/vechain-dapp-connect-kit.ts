import { html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Theme, ThemeMode } from '../constants';

@customElement('vwk-vechain-dapp-connect-kit')
export class VechainDappConnectKit extends LitElement {
    @property({ type: String })
    mode: ThemeMode = 'LIGHT';

    @property({ type: String })
    theme: Theme = 'DEFAULT';

    render(): TemplateResult {
        return html` <dapp-kit-context-provider>
            <vwk-connect-button-with-modal
                .mode=${this.mode}
            ></vwk-connect-button-with-modal>
        </dapp-kit-context-provider>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vwk-vechain-dapp-connect-kit': VechainDappConnectKit;
    }
}
