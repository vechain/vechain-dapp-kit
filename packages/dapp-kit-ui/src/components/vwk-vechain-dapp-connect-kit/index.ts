import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Theme, ThemeMode } from '../../constants';

@customElement('vwk-vechain-dapp-connect-kit')
export class VechainDappConnectKit extends LitElement {
    @property({ type: String })
    mode: ThemeMode = 'LIGHT';

    @property({ type: String })
    theme: Theme = 'DEFAULT';

    render() {
        return html`<dapp-kit-context-provider
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
