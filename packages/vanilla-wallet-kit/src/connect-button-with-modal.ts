import {LitElement, html, nothing} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {Theme, ThemeMode} from './wallet-kit';

@customElement('connect-button-with-modal')
class ConnectButtonWithModal extends LitElement {
  @property({type: String})
  override title = 'Connect Wallet';

  @property({type: ThemeMode})
  mode = ThemeMode.Light;

  @property({type: Theme})
  theme = Theme.Default;

  @property({type: Boolean})
  open = false;

  private handleOpen = () => {
    this.open = true;
  };

  private handleClose = () => {
    this.open = false;
  };

  override render() {
    return html`
      <div>
        <connect-button
          .title=${this.title}
          .mode=${this.mode}
          .theme=${this.theme}
          .onClick=${this.handleOpen}
        ></connect-button>
        <connect-modal
          open=${this.open || nothing}
          .onClose=${this.handleClose}
        ></connect-modal>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'connect-button-with-modal': ConnectButtonWithModal;
  }
}
