import type { TemplateResult } from 'lit';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { SourceInfo } from '../../constants';
import { Colors } from '../../constants';
import { DarkCloseSvg, LightCloseSvg } from '../../assets';
import { dispatchCustomEvent, subscribeToCustomEvent } from '../../utils';
import type { Theme, ThemeMode } from '../../constants/theme';
import { friendlyAddress, getPicassoImage } from '../../utils/account';
import {
    DarkDisconnectSvg,
    LightDisconnectSvg,
} from '../../assets/icons/disconnect';

@customElement('vwk-connected-address-modal')
export class ConnectedAddressModal extends LitElement {
    static override styles = css`
        .modal-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
            padding: 20px;
            transition: width 5s, height 4s;
            font-family: 'Inter', sans-serif;
        }

        .modal-header {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            padding-bottom: 10px;
            font-family: 'Inter', sans-serif;
        }

        .modal-body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 20px;
            transition: width 2s, height 4s;
        }

        .modal-footer {
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top: 10px;
            font-family: 'Inter', sans-serif;
        }

        .close-icon {
            position: absolute;
            right: 20px;
        }

        .icon {
            cursor: pointer;
            width: 25px;
            height: 25px;
        }

        .icon.LIGHT:hover {
            background-color: ${Colors.LightGrey};
        }

        .icon.DARK:hover {
            background-color: ${Colors.DarkGrey};
        }

        button {
            cursor: pointer;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 10px;
            border: none;
            border-radius: 12px;
            padding: 8px 14px;
            font-size: 14px;
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
            background-color: ${Colors.DarkGrey};
            color: ${Colors.LightGrey};
        }

        .address-icon {
            width: 30%;
            margin-right: 4px;
            border-radius: 50%;
        }
        .title {
            font-size: 20px;
            font-weight: 600;
        }
        .wallet-address {
            font-size: 19px;
        }
    `;

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
                            ${
                                this.mode === 'LIGHT'
                                    ? LightCloseSvg
                                    : DarkCloseSvg
                            }
                        </div>
                    </div>
                    <div class="modal-body">
                        <img
                            class="address-icon"
                            src=${getPicassoImage(this.address ?? '')}
                        />
                        <span class="wallet-address">
                            ${friendlyAddress(this.address ?? '')}
                        </span>
                        
                </div>
                <div class="modal-footer">
                            <button
                                class="${this.mode} ${this.theme}"
                                @click=${this.onDisconnectClick}
                            >
                            <div class="icon ${this.mode}">
                            ${
                                this.mode === 'LIGHT'
                                    ? LightDisconnectSvg
                                    : DarkDisconnectSvg
                            }</div>
                                Disconnect
                            </button>
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
        'vwk-connected-address-modal': ConnectedAddressModal;
    }
}
