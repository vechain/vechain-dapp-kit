import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {DarkCloseSvg, LightCloseSvg} from '../../assets';
import {SourceInfo, Theme, ThemeMode, WalletSources} from '../../wallet-kit';

@customElement('vwk-connect-modal')
class ConnectModal extends LitElement {
  static override styles = css`
    .modal-container {
      padding: 20px;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      font-family: 'Inter', sans-serif;
    }
    .modal-body {
      flex-direction: column;
    }
    .close-icon {
      cursor: pointer;
      width: 20px;
      height: 20px;
    }
  `;

  @property({type: Boolean})
  open = false;

  @property({type: Function})
  onClose = () => {};

  @property({type: Function})
  onSourceClick?: (source?: SourceInfo) => {} = undefined;

  @property()
  mode = ThemeMode.Light;

  @property()
  theme = Theme.Default;

  override render() {
    return html`
      <vwk-fonts></vwk-fonts>
      <vwk-base-modal
        .open=${this.open}
        .onClose=${this.onClose}
        .mode=${this.mode}
        .theme=${this.theme}
      >
        <div class="modal-container">
          <div class="modal-header">
            <div></div>
            <div>Connect Wallet</div>
            <div class="close-icon" @click=${this.onClose}>
              ${this.mode == ThemeMode.Light ? LightCloseSvg : DarkCloseSvg}
            </div>
          </div>
          <div class="modal-body">
            ${WalletSources.map(
              (source) =>
                html`<vwk-source-card
                  .source=${source}
                  .mode=${this.mode}
                  .onClick=${this.onSourceClick}
                ></vwk-source-card>`
            )}
          </div>
        </div>
      </vwk-base-modal>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vwk-connect-modal': ConnectModal;
  }
}
