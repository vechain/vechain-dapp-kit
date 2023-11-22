import type { TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { WalletManager } from '@vechainfoundation/dapp-kit';
import type { SourceInfo, Theme, ThemeMode } from '../../constants';
import { DAppKit } from '../../client';

@customElement('vwk-connect-button-with-modal')
export class ConnectButtonWithModal extends LitElement {
    @property()
    override title = 'Connect Wallet';

    @property({ type: String })
    mode: ThemeMode = 'LIGHT';

    @property({ type: String })
    theme: Theme = 'DEFAULT';

    @property({ type: Boolean })
    open = false;

    @property({ type: String })
    address?: string;

    private get wallet(): WalletManager {
        return DAppKit.connex.wallet;
    }

    @property({ type: Function })
    onSourceClick = (source?: SourceInfo): void => {
        if (source) {
            this.wallet.setSource(source.id);
            this.wallet
                .connect()
                // eslint-disable-next-line no-console
                .then((res) => (this.address = res.account))
                .finally(() => {
                    this.open = false;
                });
        }
    };

    @property({ type: Function })
    onDisconnectClick = (): void => {
        this.wallet.disconnect().finally(() => {
            this.address = undefined;
        });
    };

    override render(): TemplateResult {
        return html`
            <div>
                <vwk-fonts></vwk-fonts>

                ${this.address
                    ? html`<vwk-connected-address-badge-with-modal
                          .mode=${this.mode}
                          .theme=${this.theme}
                          .address=${this.address}
                          .onDisconnectClick=${this.onDisconnectClick}
                      ></vwk-connected-address-badge-with-modal>`
                    : html`<vwk-connect-button
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
