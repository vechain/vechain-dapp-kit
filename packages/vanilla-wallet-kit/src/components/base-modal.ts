import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('base-modal')
class Modal extends LitElement {
  @property({type: Boolean})
  open = false;

  static override styles = css`
    .modal-container {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .modal {
      position: absolute;
      background-color: white;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
    }

    @media (max-width: 600px) {
      .modal {
        width: 100%;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }

    @media (min-width: 600px) {
      .modal {
        width: 400px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 16px;
      }
    }
  `;

  @property({type: Function})
  onClose = () => {};

  override render() {
    if (!this.open) return html``;
    return html`
      <div class="modal-container" @click=${this.onClose}>
        <div class="modal">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'base-modal': Modal;
  }
}
