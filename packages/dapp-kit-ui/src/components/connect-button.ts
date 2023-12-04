import type { TemplateResult } from 'lit';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Theme, ThemeMode } from '../constants/theme';
import { buttonStyle } from '../assets/styles';

@customElement('vwk-connect-button')
export class ConnectButton extends LitElement {
    static override styles = [
        buttonStyle,
        css`
            button {
                width: auto;
            }
        `,
    ];

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
