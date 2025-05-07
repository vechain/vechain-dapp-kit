import type { TemplateResult } from 'lit';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DAppKitLogger, type WalletManager } from '@vechain/dapp-kit';
import {
    type I18n,
    type SourceInfo,
    type ThemeMode,
    defaultI18n,
    Font,
    WalletSources,
    VEWORLD_WEBSITE,
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

let openWcQrcodeListener: () => void;
let closeWcQrcodeListener: () => void;
let openWalletModalListener: () => void;
let closeWalletModalListener: () => void;
let requestConnectionCertificateListener: () => void;
let closeConnectionCertificateRequestListener: () => void;

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

        openWcQrcodeListener = subscribeToCustomEvent(
            'vdk-open-wc-qrcode',
            (options) => {
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
            },
        );
        closeWcQrcodeListener = subscribeToCustomEvent(
            'vdk-close-wc-qrcode',
            () => {
                this.walletConnectQRcode = undefined;
                this.openingVeWorld = false;
            },
        );
        openWalletModalListener = subscribeToCustomEvent(
            'vdk-open-wallet-modal',
            () => {
                if (window.vechain?.isInAppBrowser) {
                    this.onSourceClick(WalletSources.veworld);
                } else {
                    this.open = true;
                }
            },
        );
        closeWalletModalListener = subscribeToCustomEvent(
            'vdk-close-wallet-modal',
            () => {
                this.open = false;
            },
        );
        requestConnectionCertificateListener = subscribeToCustomEvent(
            'vdk-request-connection-certificate',
            () => {
                this.requestForConnectionCertificate = true;
            },
        );
        closeConnectionCertificateRequestListener = subscribeToCustomEvent(
            'vdk-close-connection-certificate-request',
            () => {
                this.requestForConnectionCertificate = false;
            },
        );
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        openWcQrcodeListener?.();
        closeWcQrcodeListener?.();
        openWalletModalListener?.();
        closeWalletModalListener?.();
        requestConnectionCertificateListener?.();
        closeConnectionCertificateRequestListener?.();
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
            if (source.id === 'veworld' && !window.vechain) {
                DAppKitLogger.debug('ConnectModal', 'Opening VeWorld website');
                window.open(
                    `${VEWORLD_WEBSITE}${encodeURIComponent(location.href)}`,
                    '_self',
                );
                return;
            }
            if (source.id !== 'wallet-connect') {
                DAppKitLogger.debug(
                    'ConnectModal',
                    'Initiating signature request',
                );
                this.setWaitingForTheSignature(true);
                this.requestForConnectionCertificate = true;
            }
            this.wallet.setSource(source.id);
            this.wallet
                .connect()
                .then(() => {
                    this.requestUpdate();
                })
                .catch((err): void => {
                    DAppKitLogger.error(
                        'Connection Attempt',
                        'error trying to connect',
                        err,
                    );
                    this.setWaitingForTheSignature(false);
                    this.requestForConnectionCertificate = false;
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

    @property()
    waitingForTheSignature = false;

    private setWaitingForTheSignature = (value: boolean): void => {
        this.waitingForTheSignature = value;
    };

    private renderContent(): TemplateResult | TemplateResult[] {
        if (this.requestForConnectionCertificate) {
            DAppKitLogger.debug(
                'ConnectModal',
                'Rendering certificate signing view',
            );
            return html`<vdk-sign-connection-certificate
                .mode=${this.mode}
                .i18n=${this.i18n}
                .language=${this.language}
                .waitingForTheSignature=${this.waitingForTheSignature}
                .setWaitingForTheSignature=${this.setWaitingForTheSignature}
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
        DAppKitUI.modal.close();
        if (this.walletConnectQRcode) {
            // this timeout is to avoid flickering on close modal animation when the user is in the wallet connect modal
            setTimeout(() => {
                this.handleBack();
                this.wallet.disconnect();
            }, 500);
        }
        if (this.requestForConnectionCertificate) {
            // this timeout is to avoid flickering on close modal animation when the user is in the wallet connect modal
            setTimeout(() => {
                DAppKitUI.modal.closeConnectionCertificateRequest();
                this.wallet.disconnect();
            }, 500);
        }
        this.onClose();
    };
}

declare global {
    interface HTMLElementTagNameMap {
        'vdk-connect-modal': ConnectModal;
    }
}
