import { createContext, provide } from '@lit/context';
import { html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { subscribeKey } from 'valtio/vanilla/utils';
import { DAppKitUI } from '../../client';

export interface DappKitContext {
    address: string;
}

export const dappKitContext = createContext<DappKitContext>(
    Symbol('dapp-kit-context'),
);

export const defaultDappKitContext: DappKitContext = {
    address: '',
};

@customElement('dapp-kit-context-provider')
export class DappKitContextProvider extends LitElement {
    @provide({ context: dappKitContext })
    @property({ attribute: false })
    dappKitContext: DappKitContext = defaultDappKitContext;

    constructor() {
        super();
        this.initListener();
    }

    // Use the `connectedCallback` lifecycle hook to retrieve the stored address
    connectedCallback(): void {
        super.connectedCallback();
        this.dappKitContext = {
            address: DAppKitUI.wallet.state.address ?? '',
        };
    }

    render(): TemplateResult {
        return html` <slot></slot>`;
    }

    private initListener(): void {
        subscribeKey(DAppKitUI.wallet.state, 'address', (v) => {
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
