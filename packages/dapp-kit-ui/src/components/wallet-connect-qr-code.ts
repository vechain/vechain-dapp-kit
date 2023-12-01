import type { TemplateResult } from 'lit';
import { css, html, LitElement, nothing, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ANDROID_STORE_URL, Colors, IOS_STORE_URL } from '../constants';
import {
    buttonStyle,
    CheckSvg,
    DarkCopySvg,
    LightCopySvg,
    VeWorldLogo,
    WalletConnectLogo,
} from '../assets';
import { isAndroid, QrCodeUtil } from '../utils';
import type { Theme, ThemeMode } from '../constants/theme';

const qrCodeSize = 280;
@customElement('vwk-wallet-connect-qrcode')
export class WalletConnectQrCode extends LitElement {
    static override styles = [
        buttonStyle,
        css`
            .qrcode-body {
                flex-direction: column;
                align-items: stretch;
                justify-content: center;
                display: flex;
            }

            .qrcode-container {
                position: relative;
                margin: 20px auto 0 auto;
                background-color: ${Colors.White};
                width: 280px;
                padding: 10px;
                border: 1px solid ${Colors.Grey};
                border-radius: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            img.wc-icon {
                position: absolute;
                width: 65px;
                height: 65px;
                object-fit: contain;
            }

            .separator {
                display: flex;
                align-items: center;
                padding: 20px 0px;
            }

            .line {
                display: flex;
                flex-grow: 1;
                height: 1px;
            }

            .line.LIGHT {
                background-color: ${Colors.Grey};
            }

            .line.DARK {
                background-color: ${Colors.Grey};
            }

            .or {
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                padding: 0 12px;
            }

            .or.LIGHT {
                color: ${Colors.Grey};
            }

            .or.DARK {
                color: ${Colors.Grey};
            }

            .icon {
                width: 20px;
                height: 20px;
            }

            .veworld-icon {
                width: 20px;
                height: 20px;
                border-radius: 5px;
            }

            @keyframes loading {
                to {
                    stroke-dashoffset: 0px;
                }
            }

            use {
                stroke: #3496ff;
                animation: loading 1s linear infinite;
            }

            svg.loader {
                position: absolute;
                fill: none;
                stroke: transparent;
                stroke-linecap: round;
                stroke-width: 1px;
                top: 10;
                left: 10;
            }

            .openingVeWorldText {
                text-align: center;
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                padding: 20px 0;
                color: #3496ff;
            }
        `,
    ];

    @property()
    mode: ThemeMode = 'LIGHT';
    @property()
    theme: Theme = 'DEFAULT';
    @property()
    walletConnectQRcode?: string = undefined;
    @property()
    showCopiedIcon = false;
    @property()
    openingVeWorld = false;

    override render(): TemplateResult | typeof nothing {
        let copyIcon = this.mode === 'LIGHT' ? LightCopySvg : DarkCopySvg;
        if (this.showCopiedIcon) {
            copyIcon = CheckSvg;
        }

        return html`
            <div class="qrcode-body">
                <div class="qrcode-container">
                    ${this.openingVeWorld ? this.svgLoaderTemplate() : nothing}
                    ${this.svgWCQrCode(this.walletConnectQRcode)}
                    <img class="wc-icon" src=${WalletConnectLogo} />
                </div>
                ${this.openingVeWorld
                    ? html`<div class="openingVeWorldText">
                          Opening VeWorld...
                      </div>`
                    : nothing}
                ${this.openingVeWorld
                    ? html`<button
                          class="${this.mode} ${this.theme}"
                          @click=${this.getVeWorld}
                      >
                          <img class="veworld-icon" src=${VeWorldLogo} />
                          Get VeWorld
                      </button>`
                    : nothing}
                <div class="separator">
                    <div class="line ${this.mode} ${this.theme}"></div>
                    <div class="or ${this.mode} ${this.theme}">or</div>
                    <div class="line ${this.mode} ${this.theme}"></div>
                </div>
                <button
                    class="${this.mode} ${this.theme}"
                    @click=${this.onCopy}
                >
                    <div class="icon">${copyIcon}</div>
                    Copy to Clipboard
                </button>
            </div>
        `;
    }

    private onCopy = async (): Promise<void> => {
        await navigator.clipboard.writeText(this.walletConnectQRcode || '');
        this.showCopiedIcon = true;
        setTimeout(() => {
            this.showCopiedIcon = false;
        }, 1000);
    };

    private getVeWorld = (): void => {
        if (isAndroid()) {
            window.open(ANDROID_STORE_URL, '_self');
        } else {
            window.open(IOS_STORE_URL, '_self');
        }
    };

    private svgLoaderTemplate(): TemplateResult {
        const ICON_SIZE = 88;
        const DH_ARRAY = 317;
        const DH_OFFSET = 425;
        const radius = '8';
        let numRadius = 0;

        if (radius.includes('%')) {
            numRadius = (ICON_SIZE / 100) * parseInt(radius, 10);
        } else {
            numRadius = parseInt(radius, 10);
        }

        numRadius *= 1.17;
        const dashArray = DH_ARRAY - numRadius * 1.57;
        const dashOffset = DH_OFFSET - numRadius * 1.8;

        return html`
            <svg
                class="loader"
                viewBox="0 0 110 110"
                width=${qrCodeSize + 50}
                height=${qrCodeSize + 50}
            >
                <rect
                    id="wcm-loader"
                    x="2"
                    y="2"
                    width="106"
                    height="106"
                    rx=${numRadius}
                ></rect>
                <use
                    xlink:href="#wcm-loader"
                    stroke-dasharray="106 ${dashArray}"
                    stroke-dashoffset=${dashOffset}
                ></use>
            </svg>
        `;
    }

    private svgWCQrCode(uri?: string): TemplateResult | typeof nothing {
        if (!uri) {
            return nothing;
        }
        return svg`
            <svg height=${qrCodeSize} width=${qrCodeSize}>
                ${QrCodeUtil.generate(uri, qrCodeSize, qrCodeSize / 4)}
            </svg>
            `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vwk-wallet-connect-qrcode': WalletConnectQrCode;
    }
}
