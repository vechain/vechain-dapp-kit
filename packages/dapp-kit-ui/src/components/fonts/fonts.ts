import type { TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('vdk-fonts')
export class Fonts extends LitElement {
    override render(): TemplateResult {
        return html`
            <style>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;700&display=swap" rel="stylesheet" />
            </style>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vdk-fonts': Fonts;
    }
}
