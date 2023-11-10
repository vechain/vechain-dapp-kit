import type { TemplateResult } from 'lit';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Theme, ThemeMode } from '@vechainfoundation/wallet-kit';
import type { OpenOptions } from '@vechainfoundation/wallet-kit/src';
import {
    DarkChevronLeftSvg,
    DarkCloseSvg,
    LightChevronLeftSvg,
    LightCloseSvg,
} from '../../assets';
import type { SourceInfo } from '../../constants';
import { Colors, WalletSources } from '../../constants';
import {
    dispatchCustomEvent,
    subscribeToCustomEvent,
} from '../../utils/events';
import { DAppKit } from '../../client';

@customElement('vwk-connect-modal')
export class ConnectModal extends LitElement {
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
    mode = ThemeMode.Light;
    @property()
    theme = Theme.Default;
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
    }

    private get availableSources(): SourceInfo[] {
        const availableSources = DAppKit.connex.wallet.getAvailableSources();

        return WalletSources.filter((src) => {
            return availableSources.includes(src.id);
        });
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
                                  ${this.mode === ThemeMode.Light
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
                        ${
                            this.mode === ThemeMode.Light
                                ? LightCloseSvg
                                : DarkCloseSvg
                        }
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
        dispatchCustomEvent('vwk-close-wc-modal', undefined);
    };

    private handleClose = (): void => {
        this.onBack();
        this.onClose();
    };
}

declare global {
    interface HTMLElementTagNameMap {
        'vwk-connect-modal': ConnectModal;
    }
}
