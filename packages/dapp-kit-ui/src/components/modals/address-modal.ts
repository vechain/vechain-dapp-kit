import type { TemplateResult } from 'lit';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { I18n } from '../../constants';
import { defaultI18n, Font } from '../../constants';
import { buttonStyle, iconButtonStyle } from '../../assets/styles';
import type { ThemeMode } from '../../constants/theme';
import {
    friendlyAddress,
    getPicassoImage,
    useTranslate,
    subscribeToCustomEvent,
} from '../../utils';
import {
    CheckSvg,
    DarkCloseSvg,
    DarkCopySvg,
    DarkDisconnectSvg,
    LightCloseSvg,
    LightCopySvg,
    LightDisconnectSvg,
} from '../../assets/icons';
import { DAppKitUI } from '../../client';
import { shortenedDomain } from '@vechain/dapp-kit';

let openWalletModalListener: () => void;
let closeWalletModalListener: () => void;
@customElement('vdk-address-modal')
export class AddressModal extends LitElement {
    static override styles = [
        buttonStyle,
        iconButtonStyle,
        css`
            .modal-container {
                display: flex;
                flex-direction: column;
                gap: 15px;
                padding: 20px;
                transition: width 5s, height 4s;
                font-family: var(--vdk-font-family, ${Font.Family});
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
                padding-bottom: 20px;
            }

            .modal-body {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 40px;
                transition: width 2s, height 4s;
            }

            .modal-footer {
                display: flex;
                justify-content: center;
                align-items: center;
                padding-top: 20px;
                font-family: var(--vdk-font-family, ${Font.Family});
            }

            .address-icon {
                width: 30%;
                margin-right: 4px;
                border-radius: 50%;
            }

            .disconnect-icon {
                width: 18px;
                height: 18px;
            }

            .title {
                font-family: var(--vdk-font-family, ${Font.Family});
                font-weight: var(
                    --vdk-font-weight-medium,
                    ${Font.Weight.Medium}
                );
            }

            .address-domain {
                font-size: var(--vdk-font-size-large, ${Font.Size.Large});
                font-family: var(--vdk-font-family, ${Font.Family});
                font-weight: var(
                    --vdk-font-weight-medium,
                    ${Font.Weight.Medium}
                );
                display: flex;
                flex-direction: row;
                justify-content: center;
            }

            .secondary-address {
                font-size: var(--vdk-font-size-small, ${Font.Size.Small});
                font-family: var(--vdk-font-family, ${Font.Family});
                font-weight: var(
                    --vdk-font-weight-regular,
                    ${Font.Weight.Regular}
                );
                display: flex;
                flex-direction: row;
                justify-content: center;
            }

            .address-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 10px;
            }

            .copy-icon {
                cursor: pointer;
                width: 20px;
                height: 20px;
                margin-left: 10px;
            }

            .copy-icon-secondary {
                cursor: pointer;
                width: 15px;
                height: 15px;
                margin-left: 8px;
            }
        `,
    ];

    @property({ type: Boolean })
    open = false;

    @property({ type: String })
    address = '';

    @property()
    accountDomain = '';

    @property()
    isAccountDomainLoading = false;

    @property({ type: Function })
    onDisconnectClick?: () => void = undefined;

    @property()
    mode: ThemeMode = 'LIGHT';

    @property()
    i18n: I18n = defaultI18n;

    @property()
    language = 'en';

    @property()
    walletConnectQRcode?: string = undefined;

    @property()
    showCopiedMainIcon = false;

    @property()
    showCopiedSecondaryIcon = false;

    constructor() {
        super();

        openWalletModalListener = subscribeToCustomEvent(
            'vdk-open-wallet-modal',
            () => {
                this.open = true;
            },
        );

        closeWalletModalListener = subscribeToCustomEvent(
            'vdk-close-wallet-modal',
            () => {
                this.open = false;
            },
        );
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        openWalletModalListener?.();
        closeWalletModalListener?.();
    }

    @property({ type: Function })
    onClose: () => void = () => nothing;

    override render(): TemplateResult {
        const translate = useTranslate(this.i18n, this.language);
        let copyMainIcon = this.mode === 'LIGHT' ? LightCopySvg : DarkCopySvg;
        if (this.showCopiedMainIcon) {
            copyMainIcon = CheckSvg;
        }
        let copySecondaryIcon =
            this.mode === 'LIGHT' ? LightCopySvg : DarkCopySvg;
        if (this.showCopiedSecondaryIcon) {
            copySecondaryIcon = CheckSvg;
        }
        const addressOrDomain =
            this.accountDomain && !this.isAccountDomainLoading
                ? shortenedDomain(this.accountDomain, 18)
                : friendlyAddress(this.address || '');
        return html`
        <vdk-fonts></vdk-fonts>
        <vdk-base-modal
                .open=${this.open}
                .onClose=${this.handleClose}
                .mode=${this.mode}
        >
            <div class="modal-container">
                <div class="modal-header">
                    <div class="icon-button"></div>
                    <div class="title">${translate('connected')}</div>
                    <div
                            class="icon-button ${this.mode}"
                            @click=${this.handleClose}
                    >
                        ${this.mode === 'LIGHT' ? LightCloseSvg : DarkCloseSvg}
                    </div>
                </div>
                <div class="modal-body">
                    <img
                            class="address-icon"
                            src=${getPicassoImage(this.address)}
                    />
                    <div class="address-container">
                    <span class="address-domain">
                            ${addressOrDomain}
                            <div class="copy-icon" @click=${
                                this.onCopyMainLabel
                            }>${copyMainIcon}</div>
                    </span>
                    ${
                        this.accountDomain
                            ? html` <span class="secondary-address">
                                  (${friendlyAddress(this.address, 8, 7)})
                                  <div
                                      class="copy-icon-secondary"
                                      @click=${this.onCopySecondaryLabel}
                                  >
                                      ${copySecondaryIcon}
                                  </div>
                              </span>`
                            : nothing
                    }
                    </div>
                </div>
                <div class="modal-footer">
                    <button
                            class="${this.mode}"
                            @click=${this.onDisconnectClick}
                            data-testid="Disconnect"
                    >
                        <div class="disconnect-icon ${this.mode}">
                            ${
                                this.mode === 'LIGHT'
                                    ? LightDisconnectSvg
                                    : DarkDisconnectSvg
                            }
                        </div>
                        ${translate('disconnect')}
                    </button>
                </div>
        </vdk-base-modal>
    `;
    }

    private onCopyMainLabel = async (): Promise<void> => {
        const text = this.accountDomain ? this.accountDomain : this.address;
        await navigator.clipboard.writeText(text);
        this.showCopiedMainIcon = true;
        setTimeout(() => {
            this.showCopiedMainIcon = false;
        }, 1000);
    };

    private onCopySecondaryLabel = async (): Promise<void> => {
        await navigator.clipboard.writeText(this.address);
        this.showCopiedSecondaryIcon = true;
        setTimeout(() => {
            this.showCopiedSecondaryIcon = false;
        }, 1000);
    };

    private handleClose = (): void => {
        DAppKitUI.modal.close();
        this.onClose();
    };
}

declare global {
    interface HTMLElementTagNameMap {
        'vdk-address-modal': AddressModal;
    }
}
