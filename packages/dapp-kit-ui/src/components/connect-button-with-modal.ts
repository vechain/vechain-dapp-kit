import { consume } from '@lit/context';
import { html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DAppKitLogger, type WalletManager } from '@vechain/dapp-kit';
import { DAppKitUI } from '../client';
import {
    defaultI18n,
    type I18n,
    type SourceInfo,
    type ThemeMode,
} from '../constants';
import {
    dappKitContext,
    defaultDappKitContext,
    type DappKitContext,
} from './provider';

@customElement('vwk-connect-button-with-modal')
export class ConnectButtonWithModal extends LitElement {
    @consume({ context: dappKitContext })
    @property({ attribute: false })
    dappKitContext: DappKitContext = defaultDappKitContext;

    @property()
    mode: ThemeMode = 'LIGHT';

    @property()
    i18n: I18n = defaultI18n;

    @property()
    language = 'en';

    private get wallet(): WalletManager {
        return DAppKitUI.wallet;
    }

    @property({ type: Function })
    onSourceClick = (source?: SourceInfo): void => {
        if (source) {
            this.wallet.setSource(source.id);
            this.wallet
                .connect()
                .then((res) => {
                    this.dappKitContext.address = res.account;
                    this.requestUpdate();
                })
                .catch((err): void => {
                    DAppKitLogger.error(
                        'Source Clicked',
                        'error trying to connect',
                        err,
                    );
                });
        }
    };

    @property({ type: Function })
    onDisconnectClick = (): void => {
        this.dappKitContext.address = '';
        this.requestUpdate();
        this.wallet.disconnect();
    };

    override render(): TemplateResult {
        return html`
            <div>
                <vwk-fonts></vwk-fonts>
                ${this.dappKitContext.address
                    ? html` <vwk-connected-address-button-with-modal
                          .mode=${this.mode}
                          .i18n=${this.i18n}
                          .language=${this.language}
                          .address=${this.dappKitContext.address}
                          .onDisconnectClick=${this.onDisconnectClick}
                      ></vwk-connected-address-button-with-modal>`
                    : html` <vwk-connect-button
                              .mode=${this.mode}
                              .i18n=${this.i18n}
                              .language=${this.language}
                          ></vwk-connect-button>
                          <vwk-connect-modal
                              .mode=${this.mode}
                              .i18n=${this.i18n}
                              .language=${this.language}
                              .onSourceClick=${this.onSourceClick}
                          ></vwk-connect-modal>`}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vwk-connect-button-with-modal': ConnectButtonWithModal;
    }
}
