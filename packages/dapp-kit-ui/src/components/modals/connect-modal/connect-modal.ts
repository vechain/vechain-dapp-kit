import type { TemplateResult } from 'lit';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { WalletManager } from '@vechain/dapp-kit';
import {
    type I18n,
    type SourceInfo,
    type ThemeMode,
    defaultI18n,
    Font,
    WalletSources,
} from '../../../constants';
import {
    DarkChevronLeftSvg,
    DarkCloseSvg,
    LightChevronLeftSvg,
    LightCloseSvg,
} from '../../../assets/icons';
import { isMobile, subscribeToCustomEvent, useTranslate } from '../../../utils';
import { DAppKitUI } from '../../../client';
import { iconButtonStyle } from '../../../assets/styles';

@customElement('vdk-connect-modal')
export class ConnectModal extends LitElement {
    static override styles = [
        iconButtonStyle,
        css`
            .modal-container {
                padding: 20px;
            }

            .modal-header {
                font-family: var(--vdk-font-family, ${Font.Family});
                font-weight: var(
                    --vdk-font-weight-medium,
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

    constructor() {
        super();

        subscribeToCustomEvent('vdk-open-wc-qrcode', (options) => {
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
        subscribeToCustomEvent('vdk-close-wc-qrcode', () => {
            this.walletConnectQRcode = undefined;
            this.openingVeWorld = false;
        });
        subscribeToCustomEvent('vdk-open-wallet-modal', () => {
            this.open = true;
        });
        subscribeToCustomEvent('vdk-close-wallet-modal', () => {
            this.open = false;
        });
        subscribeToCustomEvent('vdk-request-connection-certificate', () => {
            this.requestForConnectionCertificate = true;
        });
        subscribeToCustomEvent(
            'vdk-close-connection-certificate-request',
            () => {
                this.requestForConnectionCertificate = false;
            },
        );
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
                .then(() => {
                    this.requestUpdate();
                })
                .finally(() => {
                    DAppKitUI.modal.close();
                });
        }
    };

    @property({ type: Function })
    onClose: () => void = () => nothing;

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

    @property()
    requestForConnectionCertificate = false;

    private renderContent(): TemplateResult | TemplateResult[] {
        if (this.requestForConnectionCertificate) {
            return html`<vdk-sign-connection-certificate
                .mode=${this.mode}
                .i18n=${this.i18n}
                .language=${this.language}
            ></vdk-sign-connection-certificate>`;
        }
        if (this.walletConnectQRcode) {
            return html` <vdk-wallet-connect-qrcode
                .openingVeWorld=${this.openingVeWorld}
                .mode=${this.mode}
                .i18n=${this.i18n}
                .language=${this.language}
                .walletConnectQRcode=${this.walletConnectQRcode}
            ></vdk-wallet-connect-qrcode>`;
        }
        return this.availableSources.map(
            (source) =>
                html` <vdk-source-card
                    .source=${source}
                    .mode=${this.mode}
                    .onClick=${this.onSourceClick}
                ></vdk-source-card>`,
        );
    }

    override render(): TemplateResult {
        const translate = useTranslate(this.i18n, this.language);
        return html`
            <vdk-fonts></vdk-fonts>
            <vdk-base-modal
                .open=${this.open}
                .onClose=${this.handleClose}
                .mode=${this.mode}
            >
                <div class="modal-container">
                    <div class="modal-header">
                        ${this.walletConnectQRcode
                            ? html` <div
                                  class="icon-button ${this.mode}"
                                  @click=${this.handleBack}
                              >
                                  ${this.mode === 'LIGHT'
                                      ? LightChevronLeftSvg
                                      : DarkChevronLeftSvg}
                              </div>`
                            : html` <div class="icon-button"></div>`}
                        <div>${translate('connect-wallet')}</div>
                        <div
                            class="icon-button ${this.mode}"
                            @click=${this.handleClose}
                        >
                            ${this.mode === 'LIGHT'
                                ? LightCloseSvg
                                : DarkCloseSvg}
                        </div>
                    </div>
                    <div class="modal-body">${this.renderContent()}</div>
                </div>
            </vdk-base-modal>
        `;
    }

    private handleBack = (): void => {
        DAppKitUI.modal.closeWalletConnect();
    };

    private handleClose = (): void => {
        if (this.requestForConnectionCertificate) {
            DAppKitUI.modal.closeConnectionCertificateRequest();
            this.wallet.disconnect();
        }
        if (this.walletConnectQRcode) {
            // this timeout is to avoid flickering on close modal animation when the user is in the wallet connect modal
            setTimeout(() => {
                this.handleBack();
                this.wallet.disconnect();
            }, 500);
        }
        DAppKitUI.modal.close();
        this.onClose();
    };
}

declare global {
    interface HTMLElementTagNameMap {
        'vdk-connect-modal': ConnectModal;
    }
}
