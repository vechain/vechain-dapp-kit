import type { TemplateResult } from 'lit';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { ThemeMode } from '../constants/theme';
import { buttonStyle } from '../assets/styles';
import { defaultI18n, type I18n } from '../constants';
import { dispatchCustomEvent, useTranslate } from '../utils';
import { DAppKitUI } from '../client';

@customElement('vwk-connect-button')
export class ConnectButton extends LitElement {
    static override styles = [
        buttonStyle,
        css`
            button {
                width: auto;
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
        dispatchCustomEvent('vwk-open-wallet-modal');
        DAppKitUI.wallet.disconnect();
        this.requestUpdate();
    };

    override render(): TemplateResult {
        const translate = useTranslate(this.i18n, this.language);
        return html`
            <button class="${this.mode}" @click=${this.handleOpen}>
                ${translate('connect-wallet')}
            </button>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vwk-connect-button': ConnectButton;
    }
}
