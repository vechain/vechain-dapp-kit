import type { TemplateResult } from 'lit';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Theme, ThemeMode } from '@vechainfoundation/wallet-kit';
import {
    DarkCloseSvg,
    LightCloseSvg,
    LightChevronLeftSvg,
    DarkChevronLeftSvg,
} from '../../assets';
import type { SourceInfo } from '../../constants';
import { Colors, WalletSources } from '../../constants';

@customElement('vwk-connect-modal')
export class ConnectModal extends LitElement {
    constructor() {
        super();
        addEventListener('vwk-open-wc-modal', (event) => {
            const uri = (event as CustomEvent).detail as string;
            this.walletConnectQRcode = uri;
        });
        addEventListener('vwk-close-wc-modal', () => {
            this.walletConnectQRcode = undefined;
        });
    }
    static override styles = css`
        .modal-container {
            padding: 20px;
            transition: width 5s, height 4s;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 10px;
            font-family: 'Inter', sans-serif;
        }

        .modal-body {
            flex-direction: column;
            transition: width 2s, height 4s;
        }

        .icon {
            cursor: pointer;
            width: 25px;
            height: 25px;
            padding: 5px;
            border-radius: 50%;
        }

        .icon.LIGHT:hover {
            background-color: ${Colors.LightGrey};
        }
        .icon.DARK:hover {
            background-color: ${Colors.DarkGrey};
        }
    `;

    @property({ type: Boolean })
    open = false;
    @property({ type: Function })
    onSourceClick?: (source?: SourceInfo) => void = undefined;
    @property()
    mode = ThemeMode.Light;
    @property()
    theme = Theme.Default;
    @property()
    walletConnectQRcode?: string = undefined;
    @property({ type: Function })
    onClose: () => void = () => nothing;

    private onBack = (): void => {
        dispatchEvent(new CustomEvent('vwk-close-wc-modal'));
    };
    private handleClose = (): void => {
        this.onBack();
        this.onClose();
    };

    override render(): TemplateResult {
        return html`
            <vwk-fonts></vwk-fonts>
            <vwk-base-modal
                .open=${this.open}
                .onClose=${this.handleClose}
                .mode=${this.mode}
                .theme=${this.theme}
            >
                <div class="modal-container">
                    <div class="modal-header">
                        ${this.walletConnectQRcode
                            ? html`<div
                                  class="icon back-icon ${this.mode}"
                                  @click=${this.onBack}
                              >
                                  ${this.mode === ThemeMode.Light
                                      ? LightChevronLeftSvg
                                      : DarkChevronLeftSvg}
                              </div>`
                            : html`<div></div>`}
                        <div>Connect Wallet</div>
                        <div
                            class="icon close-icon ${this.mode}"
                            @click=${this.handleClose}
                        >
                            ${this.mode === ThemeMode.Light
                                ? LightCloseSvg
                                : DarkCloseSvg}
                        </div>
                    </div>
                    <div class="modal-body">
                        ${this.walletConnectQRcode
                            ? html`<vwk-wallet-connect-qrcode
                                  .mode=${this.mode}
                                  .theme=${this.theme}
                                  .walletConnectQRcode=${this
                                      .walletConnectQRcode}
                              ></vwk-wallet-connect-qrcode>`
                            : WalletSources.map(
                                  (source) =>
                                      html` <vwk-source-card
                                          .source=${source}
                                          .mode=${this.mode}
                                          .onClick=${this.onSourceClick}
                                      ></vwk-source-card>`,
                              )}
                    </div>
                </div>
            </vwk-base-modal>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vwk-connect-modal': ConnectModal;
    }
}
