import { css, html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Font, type ThemeMode } from '../../constants';
import { friendlyAddress, getPicassoImage } from '../../utils/account';
import { buttonStyle } from '../../assets/styles';
import { DAppKitUI } from '../../client';
import { shortenedDomain } from '@vechain/dapp-kit';

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

            button.mobile {
                padding: 0px;
            }

            button.mobile:hover {
                opacity: 0.9;
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

            .address-icon.mobile {
                width: 41px;
                height: 41px;
                border-radius: 12px;
            }
        `,
    ];

    @property()
    address?: string;

    @property()
    accountDomain = '';

    @property()
    isAccountDomainLoading = false;

    @property()
    mode: ThemeMode = 'LIGHT';

    @property()
    handleOpen = (): void => {
        DAppKitUI.modal.open();
    };

    @property()
    disabled = false;

    @property()
    mobile = false;

    render(): TemplateResult {
        if (this.mobile) {
            return html` <vdk-fonts></vdk-fonts>
                <button
                    class="wallet-button ${this.mode} mobile"
                    @click=${this.handleOpen}
                    ?disabled=${this.disabled}
                >
                    <img
                        class="address-icon mobile"
                        src=${getPicassoImage(this.address ?? '')}
                    />
                </button>`;
        }

        const addressOrDomain =
            this.accountDomain && !this.isAccountDomainLoading
                ? shortenedDomain(this.accountDomain, 7)
                : friendlyAddress(this.address ?? '');
        return html` <vdk-fonts></vdk-fonts>
            <button
                class="wallet-button ${this.mode}"
                @click=${this.handleOpen}
                ?disabled=${this.disabled}
            >
                <img
                    class="address-icon"
                    src=${getPicassoImage(this.address ?? '')}
                />
                <span class="wallet-address">${addressOrDomain}</span>
            </button>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vdk-address-button': AddressButton;
    }
}
