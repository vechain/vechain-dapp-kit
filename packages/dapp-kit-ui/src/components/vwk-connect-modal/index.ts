import type { TemplateResult } from 'lit';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { OpenOptions } from '@vechainfoundation/dapp-kit';
import type { SourceInfo } from '../../constants';
import { Colors, WalletSources } from '../../constants';
import {
    DarkChevronLeftSvg,
    DarkCloseSvg,
    LightChevronLeftSvg,
    LightCloseSvg,
} from '../../assets';
import { subscribeToCustomEvent } from '../../utils';
import { DAppKit } from '../../client';
import type { Theme, ThemeMode } from '../../constants/theme';

@customElement('vwk-connect-modal')
export class ConnectModal extends LitElement {
    static override styles = css`
        .modal-container {
            padding: 20px;
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
        }

        .modal-footer {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-top: 10px;
            font-family: 'Inter', sans-serif;
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

        button {
            cursor: pointer;
            display: block;
            border: none;
            border-radius: 12px;
            padding: 8px 12px;
            font-family: 'Inter', sans-serif;
        }

        button:hover {
            opacity: 0.9;
        }

        button.LIGHT {
            background-color: ${Colors.LightGrey};
            color: ${Colors.Dark};
        }

        button.DARK {
            background-color: ${Colors.Dark};
            color: ${Colors.LightGrey};
        }
    `;
    @property({ type: Boolean })
    open = false;
    @property({ type: Function })
    onSourceClick?: (source?: SourceInfo) => void = undefined;
    @property()
    mode: ThemeMode = 'LIGHT';
    @property()
    theme: Theme = 'DEFAULT';
    @property()
    walletConnectQRcode?: string = undefined;

    constructor() {
        super();

        subscribeToCustomEvent('vwk-open-wc-modal', (options: OpenOptions) => {
            this.open = true;
            this.walletConnectQRcode = options.uri;
        });

        subscribeToCustomEvent('vwk-close-wc-modal', () => {
            this.open = false;
            this.walletConnectQRcode = undefined;
        });

        subscribeToCustomEvent('vwk-open-wallet-modal', () => {
            this.open = true;
        });

        subscribeToCustomEvent('vwk-close-wallet-modal', () => {
            this.open = false;
        });
    }

    private get availableSources(): SourceInfo[] {
        return DAppKit.connex.wallet.state.availableSources.map(
            (source) => WalletSources[source],
        );
    }

    @property({ type: Function })
    onClose: () => void = () => nothing;

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
                    ${
                        this.walletConnectQRcode
                            ? html` <div
                                  class="icon back-icon ${this.mode}"
                                  @click=${this.onBack}
                              >
                                  ${this.mode === 'LIGHT'
                                      ? LightChevronLeftSvg
                                      : DarkChevronLeftSvg}
                              </div>`
                            : html` <div></div>`
                    }
                    <div>Connect Wallet</div>
                    <div
                            class="icon close-icon ${this.mode}"
                            @click=${this.handleClose}
                    >
                        ${this.mode === 'LIGHT' ? LightCloseSvg : DarkCloseSvg}
                    </div>
                </div>
                <div class="modal-body">
                    ${
                        this.walletConnectQRcode
                            ? html` <vwk-wallet-connect-qrcode
                                  .mode=${this.mode}
                                  .theme=${this.theme}
                                  .walletConnectQRcode=${this
                                      .walletConnectQRcode}
                              ></vwk-wallet-connect-qrcode>`
                            : this.availableSources.map(
                                  (source) =>
                                      html` <vwk-source-card
                                          .source=${source}
                                          .mode=${this.mode}
                                          .onClick=${this.onSourceClick}
                                      ></vwk-source-card>`,
                              )
                    }
                </div>

        </vwk-base-modal>
    `;
    }

    private onBack = (): void => {
        this.walletConnectQRcode = undefined;
    };

    private handleClose = (): void => {
        // this timeout is to avoid flickering on close modal animation when the user is in the wallet connect modal
        setTimeout(() => {
            this.onBack();
        }, 500);
        this.onClose();
    };
}

declare global {
    interface HTMLElementTagNameMap {
        'vwk-connect-modal': ConnectModal;
    }
}
