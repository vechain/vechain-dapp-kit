import { css, html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Font, type ThemeMode } from '../../constants';
import { friendlyAddress, getPicassoImage } from '../../utils/account';
import { buttonStyle } from '../../assets/styles';
import { DAppKitUI } from '../../client';

@customElement('vdk-address-button')
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
                font-size: var(--vdk-font-size-medium, ${Font.Size.Medium});
                margin-left: 8px;
                font-family: var(--vdk-font-family, ${Font.Family});
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
    mode: ThemeMode = 'LIGHT';

    @property()
    handleOpen = (): void => {
        DAppKitUI.modal.open();
    };

    render(): TemplateResult {
        return html` <vdk-fonts></vdk-fonts>
            <button
                class="wallet-button ${this.mode}"
                @click=${this.handleOpen}
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
        'vdk-address-button': AddressButton;
    }
}
