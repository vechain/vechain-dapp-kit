import { css, html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type ThemeMode } from '../constants';
import { friendlyAddress, getPicassoImage } from '../utils/account';
import { triggerButtonStyle } from '../assets';

@customElement('vwk-connected-address-badge')
export class AddressBadge extends LitElement {
    static override styles = [
        triggerButtonStyle,
        css`
            button {
                padding: 9px 12px;
            }

            /* Style for the wallet address */

            .wallet-address {
                font-size: 14px;
                margin-left: 8px;
                font-family: 'Inter', sans-serif;
            }

            .address-icon {
                width: 23px;
                height: 23px;
                margin-right: 4px;
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
            class="wallet-badge ${this.mode}"
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
        'vwk-connected-address-badge': AddressBadge;
    }
}
