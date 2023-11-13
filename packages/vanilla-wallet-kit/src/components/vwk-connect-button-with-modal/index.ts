import type { TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { SourceInfo } from '../../constants';
import { Theme, ThemeMode } from '../../constants';
import { DAppKit } from '../../client';

@customElement('vwk-connect-button-with-modal')
export class ConnectButtonWithModal extends LitElement {
    @property()
    override title = 'Connect Wallet';

    @property({ type: ThemeMode })
    mode = ThemeMode.Light;

    @property({ type: Theme })
    theme = Theme.Default;

    @property({ type: Boolean })
    open = false;

    @property({ type: Function })
    onSourceClick?: (e: SourceInfo) => void;

    override render(): TemplateResult {
        return html`
            <div>
                <vwk-fonts></vwk-fonts>
                <vwk-connect-button
                    .title=${this.title}
                    .mode=${this.mode}
                    .theme=${this.theme}
                    .onClick=${this.handleOpen}
                ></vwk-connect-button>
                <vwk-connect-modal
                    .mode=${this.mode}
                    .theme=${this.theme}
                    .open=${this.open}
                    .onClose=${this.handleClose}
                    .onSourceClick=${this.onSourceClick}
                ></vwk-connect-modal>
            </div>
        `;
    }

    private handleOpen = (): void => {
        DAppKit.connex.wallet.disconnect().finally(() => {
            this.open = true;
        });
    };

    private handleClose = (): void => {
        this.open = false;
    };
}

declare global {
    interface HTMLElementTagNameMap {
        'vwk-connect-button-with-modal': ConnectButtonWithModal;
    }
}
