import {LitElement, html, css, nothing} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {CloseSvg} from './assets';

@customElement('connect-modal')
class ConnectModal extends LitElement {
  @property({type: Boolean})
  open = false;

  static override styles = css`
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .close-icon {
      cursor: pointer;
      width: 20px;
      height: 20px;
    }
  `;

  @property({type: Function})
  onClose = () => {};

  override render() {
    return html`
      <base-modal open=${this.open || nothing} .onClose=${this.onClose}>
        <div class="modal-header">
          <div></div>
          <h3>Connect Wallet</h3>
          <div class="close-icon" @click=${this.onClose}>${CloseSvg}</div>
          <w3m-button />
        </div>
      </base-modal>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'connect-modal': ConnectModal;
  }
}
