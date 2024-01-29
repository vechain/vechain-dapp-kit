import type { TemplateResult } from 'lit';
import { css, html, LitElement, nothing, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
    ANDROID_STORE_URL,
    Colors,
    defaultI18n,
    Font,
    type I18n,
    IOS_STORE_URL,
    type ThemeMode,
} from '../../../constants';
import { isAndroid, QrCodeUtil, useTranslate } from '../../../utils';
import {
    CheckSvg,
    DarkCopySvg,
    LightCopySvg,
    WalletConnectLogoSvg,
} from '../../../assets/icons';
import { buttonStyle } from '../../../assets/styles';
import { VeWorldLogo } from '../../../assets/images';

const qrCodeSize = 280;
@customElement('vdk-wallet-connect-qrcode')
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
                width: 280px;
                padding: 10px;
                border-radius: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid;
            }

            .qrcode-container.LIGHT {
                border-color: var(
                    --vdk-color-light-quaternary,
                    ${Colors.Light.Quaternary}
                );
            }

            .qrcode-container.DARK {
                border-color: var(
                    --vdk-color-dark-quaternary,
                    ${Colors.Dark.Quaternary}
                );
            }

            div.wc-icon {
                border-radius: 12px;
                overflow: hidden;
                position: absolute;
                width: 68px;
                height: 68px;
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
                background: var(
                    --vdk-color-light-quaternary,
                    ${Colors.Light.Quaternary}
                );
            }

            .line.DARK {
                background: var(
                    --vdk-color-dark-quaternary,
                    ${Colors.Dark.Quaternary}
                );
            }

            .or {
                font-family: var(--vdk-font-family, ${Font.Family});
                font-size: var(--vdk-font-size-medium, ${Font.Size.Medium});
                padding: 0 12px;
            }

            .or.LIGHT {
                color: var(
                    --vdk-color-light-quaternary,
                    ${Colors.Light.Quaternary}
                );
            }

            .or.DARK {
                color: var(
                    --vdk-color-dark-quaternary,
                    ${Colors.Dark.Quaternary}
                );
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
                stroke: var(
                    --vdk-color-walletconnectblue,
                    ${Colors.WalletConnectBlue}
                );
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
                font-family: var(--vdk-font-family, ${Font.Family});
                font-size: var(--vdk-font-size-medium, ${Font.Size.Medium});
                padding: 20px 0;
                color: var(
                    --vdk-color-walletconnectblue,
                    ${Colors.WalletConnectBlue}
                );
            }
        `,
    ];

    @property()
    mode: ThemeMode = 'LIGHT';
    @property()
    i18n: I18n = defaultI18n;
    @property()
    language = 'en';
    @property()
    walletConnectQRcode?: string = undefined;
    @property()
    showCopiedIcon = false;
    @property()
    openingVeWorld = false;

    override render(): TemplateResult | typeof nothing {
        const translate = useTranslate(this.i18n, this.language);
        let copyIcon = this.mode === 'LIGHT' ? LightCopySvg : DarkCopySvg;
        if (this.showCopiedIcon) {
            copyIcon = CheckSvg;
        }

        return html`
            <div class="qrcode-body">
                <div class="qrcode-container ${this.mode}">
                    ${this.openingVeWorld ? this.svgLoaderTemplate() : nothing}
                    ${this.svgWCQrCode(this.walletConnectQRcode)}
                    <div class="wc-icon">${WalletConnectLogoSvg}</div>
                </div>
                ${this.openingVeWorld
                    ? html`<div class="openingVeWorldText">
                          ${translate('opening-veworld')}
                      </div>`
                    : nothing}
                ${this.openingVeWorld
                    ? html`<button
                          class="${this.mode}"
                          @click=${this.getVeWorld}
                      >
                          <img class="veworld-icon" src=${VeWorldLogo} />
                          ${translate('get-veworld')}
                      </button>`
                    : nothing}
                <div class="separator">
                    <div class="line ${this.mode}"></div>
                    <div class="or ${this.mode}">or</div>
                    <div class="line ${this.mode}"></div>
                </div>
                <button class="${this.mode}" @click=${this.onCopy}>
                    <div class="icon">${copyIcon}</div>
                    ${translate('copy-to-clipboard')}
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
                ${QrCodeUtil.generate({
                    uri,
                    size: qrCodeSize,
                    logoSize: qrCodeSize / 4,
                    dotColor:
                        this.mode === 'LIGHT'
                            ? Colors.Light.Tertiary.toString()
                            : Colors.Dark.Tertiary.toString(),
                    edgeColor:
                        this.mode === 'LIGHT'
                            ? Colors.Light.Secondary.toString()
                            : Colors.Dark.Secondary.toString(),
                })}
            </svg>
            `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vdk-wallet-connect-qrcode': WalletConnectQrCode;
    }
}
