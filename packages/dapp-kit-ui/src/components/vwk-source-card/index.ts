import type { TemplateResult } from 'lit';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { WalletManager } from '@vechainfoundation/dapp-kit';
import type { SourceInfo } from '../../constants';
import { Colors } from '../../constants';
import { DAppKit } from '../../client';
import type { Theme, ThemeMode } from '../../constants/theme';

@customElement('vwk-source-card')
export class SourceCard extends LitElement {
    static override styles = css`
        .card {
            padding: 16px;
            border-radius: 12px;
            display: flex;
            flex: 1;
            margin: 8px 0;
            cursor: pointer;
            justify-content: space-between;
            align-items: center;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
        }

        .card:hover {
            opacity: 0.9;
        }

        .card:active {
            opacity: 0.8;
        }

        .card.LIGHT {
            background-color: ${Colors.LightGrey};
            color: ${Colors.Dark};
        }

        .card.DARK {
            background-color: ${Colors.DarkGrey};
            color: ${Colors.White};
        }

        img {
            width: 32px;
            height: 32px;
            object-fit: contain;
        }
    `;

    @property({ type: Function })
    onClick?: (source?: SourceInfo) => void = undefined;

    @property()
    mode: ThemeMode = 'LIGHT';

    @property()
    theme: Theme = 'DEFAULT';

    @property()
    source?: SourceInfo = undefined;

    get wallet(): WalletManager {
        return DAppKit.connex.wallet;
    }

    handleSourceClick(): void {
        this.onClick?.(this.source);
    }

    override render(): TemplateResult {
        return html`
            <div
                class="card ${this.mode} ${this.theme}"
                @click=${(): void => this.handleSourceClick()}
            >
                <div>${this.source?.name}</div>
                <img src=${this.source?.logo} />
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vwk-source-card': SourceCard;
    }
}
