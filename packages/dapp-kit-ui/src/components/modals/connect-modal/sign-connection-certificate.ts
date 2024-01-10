import { css, html, LitElement, type nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { defaultI18n, type I18n, type ThemeMode } from '../../../constants';
import { useTranslate } from '../../../utils';
import { buttonStyle } from '../../../assets/styles';
import { DAppKitUI } from '../../../client';

const handleSignCertificate = async (): Promise<void> => {
    await DAppKitUI.wallet.signConnectionCertificate();
};

@customElement('vdk-sign-connection-certificate')
export class SignConnectionCertificate extends LitElement {
    static override styles = [
        buttonStyle,
        css`
            .signCertificateText {
                margin: 20px;
                text-align: center;
            }
        `,
    ];

    @property()
    mode: ThemeMode = 'LIGHT';
    @property()
    i18n: I18n = defaultI18n;
    @property()
    language = 'en';

    override render(): TemplateResult | typeof nothing {
        const translate = useTranslate(this.i18n, this.language);

        return html`
            <div>
                <div class="signCertificateText">
                    ${translate('sign-connection-certificate-description')}
                </div>
                <button class="${this.mode}" @click=${handleSignCertificate}>
                    ${translate('sign-connection-certificate-button')}
                </button>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vdk-sign-connection-certificate': SignConnectionCertificate;
    }
}
