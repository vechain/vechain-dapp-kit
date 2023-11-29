import { createContext, provide } from '@lit/context';
import { html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { subscribeKey } from 'valtio/utils';
import { DAppKit } from '../../client';

export interface DappKitContext {
    address: string;
}

export const dappKitContext = createContext<DappKitContext>(
    Symbol('dapp-kit-context'),
);

@customElement('dapp-kit-context-provider')
export class DappKitContextProvider extends LitElement {
    @provide({ context: dappKitContext })
    @property({ attribute: false })
    dappKitContext: DappKitContext = {
        address: '',
    };

    constructor() {
        super();
        this.initListener();
    }

    // Use the `connectedCallback` lifecycle hook to retrieve the stored address
    connectedCallback(): void {
        super.connectedCallback();
        this.dappKitContext = {
            address: DAppKit.connex.wallet.state.address ?? '',
        };
    }

    render(): TemplateResult {
        return html` <slot></slot>`;
    }

    private initListener(): void {
        subscribeKey(DAppKit.connex.wallet.state, 'address', (v) => {
            this.dappKitContext.address = v ?? '';
            this.requestUpdate();
        });
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'dapp-kit-context-provider': DappKitContextProvider;
    }
}
