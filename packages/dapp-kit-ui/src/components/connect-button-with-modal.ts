import { consume } from '@lit/context';
import { html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { WalletManager } from '@vechainfoundation/dapp-kit';
import { DAppKit } from '../client';
import type { SourceInfo, Theme, ThemeMode } from '../constants';
import type { DappKitContext } from './provider';
import { dappKitContext } from './provider';

@customElement('vwk-connect-button-with-modal')
export class ConnectButtonWithModal extends LitElement {
    @consume({ context: dappKitContext })
    @property({ attribute: false })
    dappKitContext: DappKitContext = {
        address: '',
    };

    @property()
    override title = 'Connect Wallet';

    @property({ type: String })
    mode: ThemeMode = 'LIGHT';

    @property({ type: String })
    theme: Theme = 'DEFAULT';

    @property({ type: Boolean })
    open = false;

    private get wallet(): WalletManager {
        return DAppKit.connex.wallet;
    }

    @property({ type: Function })
    onSourceClick = (source?: SourceInfo): void => {
        if (source) {
            this.wallet.setSource(source.id);
            this.wallet.connect().finally(() => {
                this.open = false;
            });
        }
    };

    @property({ type: Function })
    onDisconnectClick = (): void => {
        this.wallet.disconnect().catch((err) => {
            // eslint-disable-next-line no-console
            console.error(err);
        });
    };

    override render(): TemplateResult {
        return html`
            <div>
                <vwk-fonts></vwk-fonts>
                ${this.dappKitContext.address
                    ? html` <vwk-connected-address-badge-with-modal
                          .mode=${this.mode}
                          .theme=${this.theme}
                          .address=${this.dappKitContext.address}
                          .onDisconnectClick=${this.onDisconnectClick}
                      ></vwk-connected-address-badge-with-modal>`
                    : html` <vwk-connect-button
                              .title=${this.title}
                              .mode=${this.mode}
                              .theme=${this.theme}
                              .onClick=${this.handleOpen}
                          ></vwk-connect-button>
                          <vwk-connect-modal
                              .mode=${this.mode}
                              .theme=${this.theme}
                              .open=${this.open}
                              .onClose=${this.handleClose}
                              .onSourceClick=${this.onSourceClick}
                          ></vwk-connect-modal>`}
            </div>
        `;
    }

    private handleOpen = (): void => {
        DAppKit.connex.wallet.disconnect().finally(() => {
            this.open = true;
        });
    };

    private handleClose = (): void => {
        this.open = false;
    };
}

declare global {
    interface HTMLElementTagNameMap {
        'vwk-connect-button-with-modal': ConnectButtonWithModal;
    }
}
