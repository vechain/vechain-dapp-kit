import type { TemplateResult } from 'lit';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { SourceInfo } from '../constants';
import { Colors, Inter } from '../constants';
import {
    DarkCloseSvg,
    LightCloseSvg,
    DarkCopySvg,
    LightCopySvg,
    CheckSvg,
    DarkDisconnectSvg,
    LightDisconnectSvg,
    buttonStyle,
} from '../assets';
import { dispatchCustomEvent, subscribeToCustomEvent } from '../utils';
import type { Theme, ThemeMode } from '../constants/theme';
import { friendlyAddress, getPicassoImage } from '../utils/account';

@customElement('vwk-connected-address-modal')
export class AddressModal extends LitElement {
    static override styles = [
        buttonStyle,
        css`
            .modal-container {
                display: flex;
                flex-direction: column;
                gap: 15px;
                padding: 20px;
                transition: width 5s, height 4s;
                font-family: var(--vwk-font-family-inter, ${Inter});
            }

            .modal-header {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                padding-bottom: 20px;
                font-family: var(--vwk-font-family-inter, ${Inter});
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
                font-family: var(--vwk-font-family-inter, ${Inter});
            }

            .close-icon {
                position: absolute;
                right: 20px;
            }

            .icon {
                cursor: pointer;
                width: 25px;
                height: 25px;
                padding: 5px;
                border-radius: 50%;
            }

            .icon.LIGHT:hover {
                background-color: var(
                    --vwk-color-xxlightgrey,
                    ${Colors.XXLightGrey}
                );
            }

            .icon.DARK:hover {
                background-color: var(
                    --vwk-color-xxdarkgrey,
                    ${Colors.XXDarkGrey}
                );
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
                font-family: var(--vwk-font-family-inter, ${Inter});
                font-weight: 500;
            }

            .wallet-address {
                font-size: 18px;
                font-weight: 500;
                font-family: var(--vwk-font-family-inter, ${Inter});
                display: flex;
                flex-direction: row;
                justify-content: center;
            }

            .copy-icon {
                cursor: pointer;
                width: 20px;
                height: 20px;
                margin-left: 10px;
            }
        `,
    ];

    @property({ type: Boolean })
    open = false;

    @property({ type: String })
    address?: string;

    @property({ type: Function })
    onSourceClick?: (source?: SourceInfo) => void = undefined;

    @property({ type: Function })
    onDisconnectClick?: () => void = undefined;

    @property()
    mode: ThemeMode = 'LIGHT';

    @property()
    theme: Theme = 'DEFAULT';

    @property()
    walletConnectQRcode?: string = undefined;

    @property()
    showCopiedIcon = false;

    constructor() {
        super();

        subscribeToCustomEvent('vwk-open-wallet-modal', () => {
            this.open = true;
        });

        subscribeToCustomEvent('vwk-close-wallet-modal', () => {
            this.open = false;
        });
    }

    @property({ type: Function })
    onClose: () => void = () => nothing;

    override render(): TemplateResult {
        let copyIcon = this.mode === 'LIGHT' ? LightCopySvg : DarkCopySvg;
        if (this.showCopiedIcon) {
            copyIcon = CheckSvg;
        }
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
                    <div class="title">Connected</div>
                    <div
                            class="icon close-icon ${this.mode}"
                            @click=${this.handleClose}
                    >
                        ${this.mode === 'LIGHT' ? LightCloseSvg : DarkCloseSvg}
                    </div>
                </div>
                <div class="modal-body">
                    <img
                            class="address-icon"
                            src=${getPicassoImage(this.address ?? '')}
                    />
                    <span class="wallet-address">
                            ${friendlyAddress(this.address ?? '')}
                            <div class="copy-icon" @click=${
                                this.onCopy
                            }>${copyIcon}</div>
                        </span>

                </div>
                <div class="modal-footer">
                    <button
                            class="${this.mode} ${this.theme}"
                            @click=${this.onDisconnectClick}
                    >
                        <div class="disconnect-icon ${this.mode}">
                            ${
                                this.mode === 'LIGHT'
                                    ? LightDisconnectSvg
                                    : DarkDisconnectSvg
                            }
                        </div>
                        Disconnect
                    </button>
                </div>
        </vwk-base-modal>
    `;
    }

    private onCopy = async (): Promise<void> => {
        await navigator.clipboard.writeText(this.address || '');
        this.showCopiedIcon = true;
        setTimeout(() => {
            this.showCopiedIcon = false;
        }, 1000);
    };

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
        'vwk-connected-address-modal': AddressModal;
    }
}
