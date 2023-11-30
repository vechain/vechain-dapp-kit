import type { TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Theme, ThemeMode } from '../constants/theme';
import { triggerButtonStyle } from '../assets';

@customElement('vwk-connect-button')
export class ConnectButton extends LitElement {
    static override styles = triggerButtonStyle;

    @property()
    override title = 'Connect Wallet';

    @property()
    mode: ThemeMode = 'LIGHT';

    @property()
    theme: Theme = 'DEFAULT';

    @property({ type: Function })
    onClick? = undefined;

    override render(): TemplateResult {
        return html`
            <button class="${this.mode} ${this.theme}" @click=${this.onClick}>
                ${this.title}
            </button>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vwk-connect-button': ConnectButton;
    }
}
