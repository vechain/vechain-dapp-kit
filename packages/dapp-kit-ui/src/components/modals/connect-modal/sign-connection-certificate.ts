import { css, html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
    Colors,
    defaultI18n,
    type I18n,
    type ThemeMode,
} from '../../../constants';
import { useTranslate } from '../../../utils';
import { buttonStyle } from '../../../assets/styles';
import { DAppKitUI } from '../../../client';

@customElement('vdk-sign-connection-certificate')
export class SignConnectionCertificate extends LitElement {
    static override styles = [
        buttonStyle,
        css`
            .signCertificateText {
                margin: 20px;
                text-align: center;
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
                z-index: 1;
            }
        `,
    ];

    constructor() {
        super();
        this.setSubmitButtonWidth();
        addEventListener('resize', this.setSubmitButtonWidth);
    }

    @property()
    mode: ThemeMode = 'LIGHT';
    @property()
    i18n: I18n = defaultI18n;
    @property()
    language = 'en';
    @property()
    waitingForTheSignature = false;
    @property()
    setWaitingForTheSignature: (v: boolean) => void = () => {};
    @property()
    submitButtonWidth = 0;

    private svgLoaderTemplate(): TemplateResult {
        const offset = 2;
        const submitButtonWidthMinusOffset = this.submitButtonWidth - offset;
        const buttonHeight = 41;
        const perimeter = (submitButtonWidthMinusOffset + buttonHeight) * 2;
        const dashLength = submitButtonWidthMinusOffset / 2;
        const spaceLength = perimeter - dashLength;
        return html`
            <svg
                class="loader"
                viewBox="0 0 ${this.submitButtonWidth} ${buttonHeight}"
                width=${this.submitButtonWidth}
                height=${buttonHeight}
            >
                <rect
                    id="sign-connection-loader"
                    x="1"
                    y="1"
                    width=${submitButtonWidthMinusOffset}
                    height=${buttonHeight - offset}
                    rx="12px"
                ></rect>
                <use
                    xlink:href="#sign-connection-loader"
                    stroke-dasharray="${dashLength} ${spaceLength}"
                    stroke-dashoffset=${perimeter}
                ></use>
            </svg>
        `;
    }

    override render(): TemplateResult | typeof nothing {
        const translate = useTranslate(this.i18n, this.language);

        return html`
            <div>
                <div class="signCertificateText">
                    ${translate('sign-connection-certificate-description')}
                </div>
                ${this.waitingForTheSignature
                    ? this.svgLoaderTemplate()
                    : nothing}
                <button
                    class="${this.mode}"
                    @click=${this.handleSignCertificate}
                    .disabled=${this.waitingForTheSignature}
                >
                    ${this.waitingForTheSignature
                        ? translate('waiting-signature')
                        : translate('sign-connection-certificate-button')}
                </button>
            </div>
        `;
    }

    private setSubmitButtonWidth = (): void => {
        const modalWidth =
            document
                .querySelector('vdk-modal')
                ?.shadowRoot?.querySelector('vdk-connect-modal')
                ?.shadowRoot?.querySelector('div')?.clientWidth ?? 0;
        this.submitButtonWidth = modalWidth ? modalWidth - 40 : 0;
    };

    private handleSignCertificate = async (): Promise<void> => {
        this.setWaitingForTheSignature(true);
        await DAppKitUI.wallet.signConnectionCertificate();
    };
}

declare global {
    interface HTMLElementTagNameMap {
        'vdk-sign-connection-certificate': SignConnectionCertificate;
    }
}
