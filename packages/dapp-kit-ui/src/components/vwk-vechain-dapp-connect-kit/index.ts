import { LitElement, type TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Theme, ThemeMode } from '../../constants';

@customElement('vwk-vechain-dapp-connect-kit')
export class VechainDappConnectKit extends LitElement {
    @property({ type: String })
    mode: ThemeMode = 'LIGHT';

    @property({ type: String })
    theme: Theme = 'DEFAULT';

    @property({ type: Boolean })
    notPersistentContext = false;

    render(): TemplateResult {
        return html`<dapp-kit-context-provider
            ?notPersistentContext=${this.notPersistentContext}
            ><vwk-connect-button-with-modal
                mode="DARK"
            ></vwk-connect-button-with-modal
        ></dapp-kit-context-provider>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vwk-vechain-dapp-connect-kit': VechainDappConnectKit;
    }
}
