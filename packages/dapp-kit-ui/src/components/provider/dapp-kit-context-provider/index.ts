import { provide } from '@lit/context';
import { LitElement, type TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
    type DappKitContext,
    dappKitContext,
    getDappKitContext,
} from '../dapp-kit-context';

@customElement('dapp-kit-context-provider')
export class DappKitContextProvider extends LitElement {
    @provide({ context: dappKitContext })
    @property({ attribute: false })
    dappKitContext: DappKitContext = {
        options: {
            notPersistentContext: false,
        },
        address: '',
    };

    @property({ type: Boolean })
    notPersistentContext = false;

    // Use the `connectedCallback` lifecycle hook to retrieve the stored address
    connectedCallback(): void {
        super.connectedCallback();
        this.dappKitContext = getDappKitContext(this.notPersistentContext);
    }

    render(): TemplateResult {
        return html`<slot></slot>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'dapp-kit-context-provider': DappKitContextProvider;
    }
}
