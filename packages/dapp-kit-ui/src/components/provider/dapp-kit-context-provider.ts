import { createContext, provide } from '@lit/context';
import { html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { snapshot, subscribe } from 'valtio';
import type { WalletManagerState } from '@vechainfoundation/dapp-kit/src/types';
import { DAppKit } from '../../client';

export const dappKitContext = createContext<WalletManagerState>(
    Symbol('dapp-kit-context'),
);

@customElement('dapp-kit-context-provider')
export class DappKitContextProvider extends LitElement {
    @provide({ context: dappKitContext })
    @property({ attribute: false })
    dappKitContext: WalletManagerState = {
        address: null,
        source: null,
        availableSources: [],
    };

    constructor() {
        super();
        subscribe(DAppKit.connex.wallet.state, () => {
            const state = snapshot(DAppKit.connex.wallet.state);

            // eslint-disable-next-line no-console
            console.log('state', state);

            this.dappKitContext.address = state.address;
            this.dappKitContext.source = state.source;
        });
    }

    // Use the `connectedCallback` lifecycle hook to retrieve the stored address
    connectedCallback(): void {
        super.connectedCallback();
        this.dappKitContext = DAppKit.connex.wallet.state;
    }

    render(): TemplateResult {
        return html` <slot></slot>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'dapp-kit-context-provider': DappKitContextProvider;
    }
}
