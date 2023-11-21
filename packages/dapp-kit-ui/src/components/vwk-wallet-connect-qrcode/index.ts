import type { TemplateResult } from 'lit';
import { css, html, LitElement, nothing, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Colors } from '../../constants';
import {
    CheckSvg,
    DarkCopySvg,
    LightCopySvg,
    WalletConnectLogo,
} from '../../assets';
import { QrCodeUtil } from '../../utils';
import type { Theme, ThemeMode } from '../../constants/theme';

@customElement('vwk-wallet-connect-qrcode')
export class WalletConnectQrCode extends LitElement {
    static override styles = css`
        .qrcode-body {
            flex-direction: column;
            align-items: stretch;
            justify-content: center;
            display: flex;
        }

        .qrcode-container {
            margin: 20px auto 20px auto;
            background-color: ${Colors.White};
            width: 280px;
            padding: 10px;
            border: 1px solid ${Colors.Grey};
            border-radius: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        img {
            position: absolute;
            width: 65px;
            height: 65px;
            object-fit: contain;
        }

        .separator {
            display: flex;
            align-items: center;
            padding-bottom: 20px;
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

        button {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            border-radius: 16px;
            padding: 16px 12px;
            font-family: 'Inter', sans-serif;
            text-align: center;
        }

        button:hover {
            opacity: 0.9;
        }

        button:active {
            opacity: 0.8;
        }

        button.LIGHT {
            background-color: ${Colors.LightGrey};
            color: ${Colors.Dark};
        }

        button.DARK {
            background-color: ${Colors.DarkGrey};
            color: ${Colors.White};
        }

        .icon {
            width: 20px;
            height: 20px;
            margin-right: 10px;
        }
    `;

    @property()
    mode: ThemeMode = 'LIGHT';
    @property()
    theme: Theme = 'DEFAULT';
    @property()
    walletConnectQRcode?: string = undefined;
    @property()
    showCopiedIcon = false;

    override render(): TemplateResult | typeof nothing {
        let copyIcon = this.mode === 'LIGHT' ? LightCopySvg : DarkCopySvg;
        if (this.showCopiedIcon) {
            copyIcon = CheckSvg;
        }
        return this.walletConnectQRcode
            ? html`
                  <div class="qrcode-body">
                      <div class="qrcode-container">
                          ${this.svgWCQrCode(this.walletConnectQRcode)}
                          <img src=${WalletConnectLogo} />
                      </div>
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
              `
            : nothing;
    }

    private onCopy = async (): Promise<void> => {
        await navigator.clipboard.writeText(this.walletConnectQRcode || '');
        this.showCopiedIcon = true;
        setTimeout(() => {
            this.showCopiedIcon = false;
        }, 3000);
    };

    private svgWCQrCode(uri: string): TemplateResult {
        const size = 280;

        return svg`
            <svg height=${size} width=${size}>
                ${QrCodeUtil.generate(uri, size, size / 4)}
            </svg>
            `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vwk-wallet-connect-qrcode': WalletConnectQrCode;
    }
}
