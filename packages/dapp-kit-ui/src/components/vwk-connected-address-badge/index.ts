import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Colors, ThemeMode } from '../../constants';
import { friendlyAddress, getPicassoImage } from '../../utils/account';

@customElement('vwk-connected-address-badge')
class ConnectedAddressBadge extends LitElement {
    static override styles = css`
        /* Style for the badge */
        .wallet-badge {
            display: flex;
            width: fit-content;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            padding: 8px;
            background-color: #4caf50;
            color: #fff;
            border-radius: 12px;
        }

        .wallet-badge.DARK {
            background-color: ${Colors.Dark};
            color: ${Colors.LightGrey};
        }

        .wallet-badge.LIGHT {
            background-color: ${Colors.LightGrey};
            color: ${Colors.Dark};
        }

        /* Style for the wallet address */
        .wallet-address {
            font-size: 14px;
            margin-left: 8px;
            font-family: monospace;
        }
        .address-icon {
            width: 23px;
            height: 23px;
            margin-right: 4px;
        }
    `;

    @property()
    address?: string = '0x123456789ABCDEF';

    @property()
    mode: ThemeMode = 'DARK';

    render() {
        return html` <div class="wallet-badge ${this.mode}">
            <img
                class="address-icon"
                src=${getPicassoImage(this.address ?? '')}
            />
            <span class="wallet-address"
                >${friendlyAddress(
                    '0x6511C57775eAaAd4b57F9Be9A14c6C026BC21216',
                )}</span
            >
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vwk-connected-address-badge': ConnectedAddressBadge;
    }
}
