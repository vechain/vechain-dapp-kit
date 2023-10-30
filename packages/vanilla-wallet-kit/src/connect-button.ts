import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {Theme, ThemeMode, Colors} from './wallet-kit';

@customElement('connect-button')
export class ConnectButton extends LitElement {
  static override styles = css`
    button {
      cursor: pointer;
      display: block;
      border: none;
      border-radius: 20px;
      padding: 8px 12px;
    }
    button:hover {
      opacity: 0.9;
    }

    button.light {
      background-color: ${Colors.LightGray};
      color: ${Colors.Dark};
    }
    button.dark {
      background-color: ${Colors.Dark};
      color: ${Colors.LightGray};
    }
  `;

  @property()
  override title = 'Connect Wallet';

  @property()
  mode = ThemeMode.Light;

  @property()
  theme = Theme.Default;

  @property({type: Function})
  onClick = () => {};

  override render() {
    return html`
      <button class="${this.mode} ${this.theme}" @click=${this.onClick}>
        ${this.title}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'connect-button': ConnectButton;
  }
}
