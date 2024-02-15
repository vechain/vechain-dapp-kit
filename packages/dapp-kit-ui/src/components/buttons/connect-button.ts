import type { TemplateResult } from 'lit';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { ThemeMode } from '../../constants/theme';
import { buttonStyle } from '../../assets/styles';
import { defaultI18n, type I18n } from '../../constants';
import { useTranslate } from '../../utils';
import { DAppKitUI } from '../../client';
import { DarkLinkSvg, LightLinkSvg } from '../../assets/icons';
import { DAppKitLogger } from '@vechain/dapp-kit';

@customElement('vdk-connect-button')
export class ConnectButton extends LitElement {
    static override styles = [
        buttonStyle,
        css`
            button {
                width: auto;
            }
            button.mobile {
                height: 41px;
                width: 41px;
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
    handleOpen = (): void => {
        if (window.vechain?.isInAppBrowser) {
            DAppKitUI.wallet.setSource('veworld');
            DAppKitUI.wallet
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
                });
        } else {
            DAppKitUI.wallet.disconnect();
            DAppKitUI.modal.open();
        }
    };

    @property()
    disabled = false;

    @property()
    mobile = false;

    override render(): TemplateResult {
        if (this.mobile) {
            const connectIcon =
                this.mode === 'LIGHT' ? LightLinkSvg : DarkLinkSvg;

            return html` <vdk-fonts></vdk-fonts>
                <button
                    class="${this.mode} mobile"
                    @click=${this.handleOpen}
                    ?disabled=${this.disabled}
                >
                    ${connectIcon}
                </button>`;
        }

        const translate = useTranslate(this.i18n, this.language);
        return html`
            <vdk-fonts></vdk-fonts>
            <button
                class="${this.mode}"
                @click=${this.handleOpen}
                ?disabled=${this.disabled}
            >
                ${translate('connect-wallet')}
            </button>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vdk-connect-button': ConnectButton;
    }
}
