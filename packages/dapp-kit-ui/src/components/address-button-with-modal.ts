import type { TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Theme, ThemeMode } from '../constants';

@customElement('vwk-connected-address-button-with-modal')
export class AddressButtonWithModal extends LitElement {
    @property({ type: String })
    mode: ThemeMode = 'LIGHT';

    @property({ type: String })
    theme: Theme = 'DEFAULT';

    @property({ type: String })
    address?: string;

    @property({ type: Boolean })
    open = false;

    @property({ type: Function })
    onDisconnectClick?: () => void = undefined;

    override render(): TemplateResult {
        return html`
            <div>
                <vwk-fonts></vwk-fonts>
                <vwk-connected-address-button
                    .mode=${this.mode}
                    .theme=${this.theme}
                    .address=${this.address}
                    .onClick=${this.handleOpen}
                ></vwk-connected-address-button>
                <vwk-connected-address-modal
                    .mode=${this.mode}
                    .theme=${this.theme}
                    .open=${this.open}
                    .onClose=${this.handleClose}
                    .address=${this.address}
                    .onDisconnectClick=${this.onDisconnectClick}
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
        'vwk-connected-address-button-with-modal': AddressButtonWithModal;
    }
}
