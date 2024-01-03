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
import { subscribeToCustomEvent } from '../../utils';

@customElement('vwk-button')
export class Button extends LitElement {
    constructor() {
        super();
        subscribeToCustomEvent('vwk-dapp-kit-configured', () => {
            this.address = DAppKitUI.wallet.state.address ?? '';
            this.initAddressListener();
        });
    }

    @property()
    mode: ThemeMode = 'LIGHT';

    @property()
    i18n: I18n = defaultI18n;

    @property()
    language = 'en';

    @property()
    address = '';

    @property({ type: Function })
    onSourceClick = (source?: SourceInfo): void => {
        if (source) {
            this.wallet.setSource(source.id);
            this.wallet
                .connect()
                .then((res) => {
                    this.address = res.account;
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
        this.address = '';
        this.requestUpdate();
        this.wallet.disconnect();
    };

    override render(): TemplateResult {
        return html`
            ${this.address
                ? html`<vwk-address-button
                      .mode=${this.mode}
                      .address=${this.address}
                  ></vwk-address-button>`
                : html`<vwk-connect-button
                      .mode=${this.mode}
                      .i18n=${this.i18n}
                      .language=${this.language}
                  ></vwk-connect-button>`}
        `;
    }

    private initAddressListener(): void {
        subscribeKey(DAppKitUI.wallet.state, 'address', (v) => {
            this.address = v ?? '';
            this.requestUpdate();
        });
    }

    private get wallet(): WalletManager {
        return DAppKitUI.wallet;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vwk-button': Button;
    }
}
