import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('connect-button')
export class ConnectButton extends LitElement {
  static override styles = css`
    button {
      display: block;
      border: none;
      border-radius: 20px;
      background-color: color(
        display-p3 0.9647058823529412 0.9686274509803922 0.9764705882352941
      );
      padding: 8px 12px;
    }
  `;

  @property()
  text = 'Connect Wallet';

  override render() {
    return html` <button @click=${this._onClick}>${this.text}</button> `;
  }

  private _onClick() {
    this.dispatchEvent(new CustomEvent('count-changed'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'connect-button': ConnectButton;
  }
}
