import type { TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { WalletManager } from '@vechainfoundation/dapp-kit';
import type { Theme, ThemeMode } from '../../constants';
import { DAppKit } from '../../client';

@customElement('vwk-connected-address-badge-with-modal')
export class ConnectedAddressBadgeWithModal extends LitElement {
    @property({ type: String })
    mode: ThemeMode = 'LIGHT';

    @property({ type: String })
    theme: Theme = 'DEFAULT';

    @property({ type: Boolean })
    open = false;

    private get wallet(): WalletManager {
        return DAppKit.connex.wallet;
    }

    override render(): TemplateResult {
        return html`
            <div>
                <vwk-fonts></vwk-fonts>
                <vwk-connected-address-badge
                    .mode=${this.mode}
                    .theme=${this.theme}
                    .onClick=${this.handleOpen}
                ></vwk-connected-address-badge>
                <vwk-connected-address-modal
                    .mode=${this.mode}
                    .theme=${this.theme}
                    .open=${this.open}
                    .onClose=${this.handleClose}
                ></vwk-connected-address-modal>
            </div>
        `;
    }

    private handleOpen = (): void => {
        this.open = true;
    };

    private handleClose = (): void => {
        this.open = false;
    };
}

declare global {
    interface HTMLElementTagNameMap {
        'vwk-connected-address-badge-with-modal': ConnectedAddressBadgeWithModal;
    }
}
