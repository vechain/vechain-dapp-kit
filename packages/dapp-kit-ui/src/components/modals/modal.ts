import { html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DAppKitLogger, type WalletManager } from '@vechain/dapp-kit';
import { subscribeKey } from 'valtio/vanilla/utils';
import { DAppKitUI } from '../../client';
import {
    defaultI18n,
    type I18n,
    type SourceInfo,
    type ThemeMode,
} from '../../constants';

@customElement('vwk-modal')
export class Modal extends LitElement {
    constructor() {
        super();
        subscribeKey(DAppKitUI.wallet.state, 'address', (v) => {
            this.address = v ?? '';
            this.requestUpdate();
        });
    }

    @property()
    address = DAppKitUI.wallet.state.address ?? '';

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
            this.wallet.connect().catch((err): void => {
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
        this.wallet.disconnect();
    };

    override render(): TemplateResult {
        return html`
            <div>
                ${this.address
                    ? html` <vwk-address-modal
                          .mode=${this.mode}
                          .i18n=${this.i18n}
                          .language=${this.language}
                          .address=${this.address}
                          .onDisconnectClick=${this.onDisconnectClick}
                      ></vwk-address-modal>`
                    : html` <vwk-connect-modal
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
        'vwk-modal': Modal;
    }
}
