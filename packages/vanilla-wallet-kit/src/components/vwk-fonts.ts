import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('vwk-fonts')
class Fonts extends LitElement {
  override render() {
    return html`
      <style>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </style>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vwk-fonts': Fonts;
  }
}
