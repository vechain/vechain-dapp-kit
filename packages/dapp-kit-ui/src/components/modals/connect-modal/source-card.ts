import type { TemplateResult } from 'lit';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { WalletManager } from '@vechain/dapp-kit';
import {
    Font,
    sourceCardBorder,
    type SourceInfo,
    type ThemeMode,
} from '../../../constants';
import { buttonStyle } from '../../../assets/styles';
import { DAppKitUI } from '../../../client';

@customElement('vdk-source-card')
export class SourceCard extends LitElement {
    static override styles = [
        buttonStyle,
        css`
            button {
                padding: 16px;
                flex: 1;
                margin: 8px 0;
                justify-content: space-between;
                font-size: var(--vdk-font-size-medium, ${Font.Size.Medium});
            }
            button.LIGHT {
                border: var(
                    --vdk-border-light-source-card,
                    ${sourceCardBorder.Light}
                );
            }
            button.DARK {
                border: var(
                    --vdk-border-dark-source-card,
                    ${sourceCardBorder.Dark}
                );
            }

            img {
                width: 32px;
                height: 32px;
                object-fit: contain;
            }
        `,
    ];

    @property({ type: Function })
    onClick?: (source?: SourceInfo) => void = undefined;

    @property()
    mode: ThemeMode = 'LIGHT';

    @property()
    source?: SourceInfo = undefined;

    get wallet(): WalletManager {
        return DAppKitUI.wallet;
    }

    handleSourceClick(): void {
        this.onClick?.(this.source);
    }

    override render(): TemplateResult {
        return html`
            <button
                class="card ${this.mode}"
                @click=${(): void => this.handleSourceClick()}
                data-testid="${this.source?.name}"
            >
                <div>${this.source?.name}</div>
                <img src=${this.source?.logo} />
            </button>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vdk-source-card': SourceCard;
    }
}
