import { html, LitElement, type TemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type WalletManager } from '@vechain/dapp-kit';
import { DAppKitUI } from '../../client';
import {
    defaultI18n,
    type I18n,
    type SourceInfo,
    type ThemeMode,
} from '../../constants';
import { subscribeToCustomEvent } from '../../utils';

let dappKitConfiguredListener: () => void;

@customElement('vdk-modal')
export class Modal extends LitElement {
    constructor() {
        super();
        if (DAppKitUI.initialized) {
            this.init();
        } else {
            dappKitConfiguredListener = subscribeToCustomEvent(
                'vdk-dapp-kit-configured',
                () => {
                    this.init();
                },
            );
        }
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        dappKitConfiguredListener?.();
    }

    private init(): void {
        this.address = DAppKitUI.wallet.state.address ?? '';
        this.wallet.subscribeToKey('address', (addr) => {
            this.address = addr ?? '';
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
    onSourceClick?: (source?: SourceInfo) => void;

    @property({ type: Function })
    onDisconnectClick = (): void => {
        this.wallet.disconnect();
    };

    override render(): TemplateResult {
        if (!DAppKitUI.initialized) {
            return html``;
        }

        return html`
            <div>
                ${this.address
                    ? html` <vdk-address-modal
                          .mode=${this.mode}
                          .i18n=${this.i18n}
                          .language=${this.language}
                          .address=${this.address}
                          .onDisconnectClick=${this.onDisconnectClick}
                      ></vdk-address-modal>`
                    : html` <vdk-connect-modal
                          .mode=${this.mode}
                          .i18n=${this.i18n}
                          .language=${this.language}
                          .onSourceClick=${this.onSourceClick || nothing}
                      ></vdk-connect-modal>`}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vdk-modal': Modal;
    }
}
