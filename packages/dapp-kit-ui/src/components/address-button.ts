import { css, html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Font, type ThemeMode } from '../constants';
import { friendlyAddress, getPicassoImage } from '../utils/account';
import { buttonStyle } from '../assets/styles';

@customElement('vwk-connected-address-button')
export class AddressButton extends LitElement {
    static override styles = [
        buttonStyle,
        css`
            button {
                padding: 9px 12px;
                width: auto;
                gap: 4px;
            }

            /* Style for the wallet address */

            .wallet-address {
                font-size: var(--vwk-font-size-medium, ${Font.Size.Medium});
                margin-left: 8px;
                font-family: var(--vwk-font-family, ${Font.Family});
            }

            .address-icon {
                width: 23px;
                height: 23px;
                border-radius: 50%;
            }
        `,
    ];

    @property()
    address?: string;

    @property()
    mode: ThemeMode = 'DARK';

    @property({ type: Function })
    onClick? = undefined;

    render(): TemplateResult {
        return html` <button
            class="wallet-button ${this.mode}"
            @click=${this.onClick}
        >
            <img
                class="address-icon"
                src=${getPicassoImage(this.address ?? '')}
            />
            <span class="wallet-address"
                >${friendlyAddress(this.address ?? '')}</span
            >
        </button>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vwk-connected-address-button': AddressButton;
    }
}
