/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('connect-modal')
export class ConnectModal extends LitElement {
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
    'connect-modal': ConnectModal;
  }
}
