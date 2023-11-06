import { LitElement, html, css } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ThemeMode, Theme } from '@vechain/wallet-kit';
import { Colors } from '../../constants';
import type { SourceInfo } from '../../constants';

@customElement('vwk-source-card')
class SourceCard extends LitElement {
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
            opacity: 0.8;
        }

        .card.LIGHT {
            background-color: ${Colors.LightGray};
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
    mode = ThemeMode.Light;

    @property()
    theme = Theme.Default;

    @property()
    source?: SourceInfo = undefined;

    handleSourceClick(): void {
        this.onClick?.(this.source);
        dispatchEvent(
            new CustomEvent('vwk-source-card-clicked', { detail: this.source }),
        );
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
