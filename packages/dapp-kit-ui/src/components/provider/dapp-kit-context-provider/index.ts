import { provide } from '@lit/context';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
    DappKitContext,
    dappKitContext,
    getDappKitContext,
} from '../dapp-kit-context';

@customElement('dapp-kit-context-provider')
export class DappKitContextProvider extends LitElement {
    @provide({ context: dappKitContext })
    @property({ attribute: false })
    dappKitContext: DappKitContext = {
        address: '',
    };

    // Use the `connectedCallback` lifecycle hook to retrieve the stored address
    connectedCallback() {
        super.connectedCallback();
        this.dappKitContext = getDappKitContext();
    }

    render() {
        return html`<slot></slot>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'dapp-kit-context-provider': DappKitContextProvider;
    }
}
