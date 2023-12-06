import type { TemplateResult } from 'lit';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { WalletManager } from '@vechain/dapp-kit';
import { consume } from '@lit/context';
import type { I18n, SourceInfo } from '../constants';
import { defaultI18n, Font, WalletSources } from '../constants';
import {
    DarkChevronLeftSvg,
    DarkCloseSvg,
    LightChevronLeftSvg,
    LightCloseSvg,
} from '../assets/icons';
import { isMobile, subscribeToCustomEvent, useTranslate } from '../utils';
import { DAppKitUI } from '../client';
import type { ThemeMode } from '../constants/theme';
import { iconButtonStyle } from '../assets/styles';
import type { DappKitContext } from './provider';
import { dappKitContext, defaultDappKitContext } from './provider';

@customElement('vwk-connect-modal')
export class ConnectModal extends LitElement {
    static override styles = [
        iconButtonStyle,
        css`
            .modal-container {
                padding: 20px;
            }

            .modal-header {
                font-family: var(--vwk-font-family, ${Font.Family});
                font-weight: var(
                    --vwk-font-weight-medium,
                    ${Font.Weight.Medium}
                );
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 10px;
            }

            .modal-body {
                flex-direction: column;
            }
        `,
    ];

    @consume({ context: dappKitContext })
    @property({ attribute: false })
    dappKitContext: DappKitContext = defaultDappKitContext;

    @property({ type: Boolean })
    open = false;

    @property({ type: Boolean })
    openingVeWorld = false;

    @property()
    mode: ThemeMode = 'LIGHT';

    @property()
    i18n: I18n = defaultI18n;

    @property()
    language = 'en';

    @property()
    walletConnectQRcode?: string = undefined;

    constructor() {
        super();

        subscribeToCustomEvent('vwk-open-wc-modal', (options) => {
            if (isMobile()) {
                this.openingVeWorld = true;
                window.open(
                    `veworld://app.veworld?uri=${encodeURIComponent(
                        options.uri,
                    )}`,
                    '_self',
                );
            }
            this.open = true;
            this.walletConnectQRcode = options.uri;
        });

        subscribeToCustomEvent('vwk-close-wc-modal', () => {
            this.open = false;
            this.walletConnectQRcode = undefined;
            this.openingVeWorld = false;
        });

        subscribeToCustomEvent('vwk-open-wallet-modal', () => {
            this.open = true;
        });

        subscribeToCustomEvent('vwk-close-wallet-modal', () => {
            this.open = false;
        });
    }

    private get availableSources(): SourceInfo[] {
        return DAppKitUI.wallet.state.availableSources.map(
            (source) => WalletSources[source],
        );
    }

    private get wallet(): WalletManager {
        return DAppKitUI.wallet;
    }

    @property({ type: Function })
    onSourceClick = (source?: SourceInfo): void => {
        if (source) {
            this.wallet.setSource(source.id);
            this.wallet
                .connect()
                .then((res) => {
                    this.dappKitContext.address = res.account;
                    this.requestUpdate();
                })
                .finally(() => {
                    this.open = false;
                });
        }
    };

    @property({ type: Function })
    onClose: () => void = () => nothing;

    override render(): TemplateResult {
        const translate = useTranslate(this.i18n, this.language);
        return html`
        <vwk-fonts></vwk-fonts>
        <vwk-base-modal
                .open=${this.open}
                .onClose=${this.handleClose}
                .mode=${this.mode}
        >
            <div class="modal-container">
                <div class="modal-header">
                    ${
                        this.walletConnectQRcode
                            ? html` <div
                                  class="icon-button ${this.mode}"
                                  @click=${this.onBack}
                              >
                                  ${this.mode === 'LIGHT'
                                      ? LightChevronLeftSvg
                                      : DarkChevronLeftSvg}
                              </div>`
                            : html` <div class="icon-button"></div>`
                    }
                    <div>${translate('connect-wallet')}</div>
                    <div
                            class="icon-button ${this.mode}"
                            @click=${this.handleClose}
                    >
                        ${this.mode === 'LIGHT' ? LightCloseSvg : DarkCloseSvg}
                    </div>
                </div>
                <div class="modal-body">
                    ${
                        this.walletConnectQRcode
                            ? html` <vwk-wallet-connect-qrcode
                                  .openingVeWorld=${this.openingVeWorld}
                                  .mode=${this.mode}
                                  .i18n=${this.i18n}
                                  .language=${this.language}
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
