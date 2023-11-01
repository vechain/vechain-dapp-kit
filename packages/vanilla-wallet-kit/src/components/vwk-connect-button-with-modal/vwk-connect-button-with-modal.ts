import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {SourceInfo, Theme, ThemeMode} from '../../wallet-kit';

@customElement('vwk-connect-button-with-modal')
class ConnectButtonWithModal extends LitElement {
  @property({type: String})
  override title = 'Connect Wallet';

  @property({type: ThemeMode})
  mode = ThemeMode.Light;

  @property({type: Theme})
  theme = Theme.Default;

  @property({type: Boolean})
  open = false;

  @property({type: Function})
  onSourceClick?: (source?: SourceInfo) => {} = undefined;

  private handleOpen = () => {
    this.open = true;
  };

  private handleClose = () => {
    this.open = false;
  };

  override render() {
    return html`
      <div>
        <vwk-fonts></vwk-fonts>
        <vwk-connect-button
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
        ></vwk-connect-modal>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vwk-connect-button-with-modal': ConnectButtonWithModal;
  }
}
