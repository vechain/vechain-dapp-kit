import { shortenedDomain } from '@vechain/dapp-kit';
import type { TemplateResult } from 'lit';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CheckSvg, DarkTrashSvg, LightTrashSvg } from '../../assets/icons';
import { buttonStyle, iconButtonStyle } from '../../assets/styles';
import { Colors, Font } from '../../constants';
import type { ThemeMode } from '../../constants/theme';
import { friendlyAddress, getPicassoImage } from '../../utils';

@customElement('vdk-account-card')
export class AccountCard extends LitElement {
    static override styles = [
        buttonStyle,
        iconButtonStyle,
        css`
            .account-card {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 8px;
                width: 100%;
            }

            .account-button {
                justify-content: space-between;
                font-size: var(--vdk-font-size-medium, ${Font.Size.Medium});
                font-weight: var(
                    --vdk-font-weight-regular,
                    ${Font.Weight.Regular}
                );
            }

            .account-button.active {
                border: 2px solid ${Colors.WalletConnectBlue};
                padding: 10px;
            }

            .account-info {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 10px;
                min-width: 0;
            }

            .account-icon {
                width: 24px;
                height: 24px;
                border-radius: 50%;
            }

            .account-address {
                font-family: var(--vdk-font-family, ${Font.Family});
            }

            .check-icon {
                width: 18px;
                height: 18px;
                display: flex;
            }
        `,
    ];

    @property()
    address = '';

    @property()
    domain = '';

    @property({ type: Boolean })
    active = false;

    @property({ type: Boolean })
    canRevoke = false;

    @property()
    mode: ThemeMode = 'LIGHT';

    @property()
    revokeLabel = '';

    @property({ type: Function })
    onSelect?: (address: string) => void = undefined;

    @property({ type: Function })
    onRevoke?: (address: string) => void = undefined;

    private handleSelect = (): void => {
        this.onSelect?.(this.address);
    };

    private handleRevoke = (event: Event): void => {
        event.stopPropagation();
        this.onRevoke?.(this.address);
    };

    override render(): TemplateResult {
        const trashIcon = this.mode === 'LIGHT' ? LightTrashSvg : DarkTrashSvg;
        const accountLabel = this.domain
            ? shortenedDomain(this.domain)
            : friendlyAddress(this.address);
        return html`
            <div class="account-card">
                <button
                    class="account-button ${this.mode} ${this.active
                        ? 'active'
                        : ''}"
                    @click=${this.handleSelect}
                    data-testid="account-${this.address}"
                >
                    <div class="account-info">
                        <img
                            class="account-icon"
                            src=${getPicassoImage(this.address)}
                        />
                        <span class="account-address">${accountLabel}</span>
                    </div>
                    ${this.active
                        ? html`<div class="check-icon">${CheckSvg}</div>`
                        : nothing}
                </button>
                ${this.canRevoke
                    ? html`<div
                          class="icon-button ${this.mode}"
                          @click=${this.handleRevoke}
                          title=${this.revokeLabel}
                          aria-label=${this.revokeLabel}
                          data-testid="revoke-${this.address}"
                      >
                          ${trashIcon}
                      </div>`
                    : nothing}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vdk-account-card': AccountCard;
    }
}
