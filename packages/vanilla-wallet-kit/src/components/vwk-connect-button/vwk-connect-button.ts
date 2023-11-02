import { LitElement, html, css } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Theme, ThemeMode, Colors } from '../../wallet-kit';

@customElement('vwk-connect-button')
class ConnectButton extends LitElement {
    static override styles = css`
        button {
            cursor: pointer;
            display: block;
            border: none;
            border-radius: 12px;
            padding: 8px 12px;
            font-family: 'Inter', sans-serif;
        }
        button:hover {
            opacity: 0.9;
        }

        button.LIGHT {
            background-color: ${Colors.LightGray};
            color: ${Colors.Dark};
        }
        button.DARK {
            background-color: ${Colors.Dark};
            color: ${Colors.LightGray};
        }
    `;

    @property()
    override title = 'Connect Wallet';

    @property()
    mode = ThemeMode.Light;

    @property()
    theme = Theme.Default;

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
