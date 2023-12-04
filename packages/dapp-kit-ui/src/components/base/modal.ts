import type { PropertyValues, TemplateResult } from 'lit';
import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type { Theme, ThemeMode } from '../../constants';
import { Breakpoint, Colors } from '../../constants';
import { modalZIndex } from '../../constants/z-index';

@customElement('vwk-base-modal')
export class Modal extends LitElement {
    static override styles = css`
        .modal-container {
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.3);
            opacity: 1;
            transition: opacity 0.1s ease-in-out;
            z-index: var(--vwk-modal-z-index, ${modalZIndex});
        }

        .modal-container.hidden {
            opacity: 0;
            pointer-events: none;
        }

        .modal {
            position: absolute;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: height 0.1s ease-in-out, transform 0.2s ease-in-out;
            overflow: hidden;
        }

        .modal-container.hidden .modal {
            transform: scale(0.97);
        }

        .modal.LIGHT {
            background-color: var(
                --vwk-color-dark-secondary,
                ${Colors.Light.Secondary}
            );
            color: var(--vwk-color-light-tertiary, ${Colors.Light.Quaternary});
        }

        .modal.DARK {
            background-color: var(
                --vwk-color-dark-secondary,
                ${Colors.Dark.Secondary}
            );
            color: var(--vwk-color-dark-tertiary, ${Colors.Dark.Quaternary});
        }

        @media (max-width: ${Breakpoint.Mobile}px) {
            .modal {
                width: 100%;
                border-top-left-radius: 16px;
                border-top-right-radius: 16px;
                bottom: 0;
                left: 0;
                right: 0;
            }
        }

        @media (min-width: ${Breakpoint.Mobile}px) {
            .modal-container {
                align-items: center;
                justify-content: center;
            }
            .modal {
                width: 350px;
                border-radius: 16px;
            }
        }
    `;
    @query('.modal-sub-container')
    modalSubContainer?: Element;
    @property()
    modalHeight?: number;
    @property({ type: Boolean })
    open = false;
    @property()
    mode: ThemeMode = 'LIGHT';
    @property()
    theme: Theme = 'DEFAULT';

    observer = new ResizeObserver(() => {
        this.modalHeight = this.modalSubContainer?.clientHeight ?? 0;
    });

    willUpdate(changedProperties: PropertyValues<this>): void {
        if (changedProperties.has('open')) {
            if (!this.modalSubContainer) {
                return;
            }
            if (this.open) {
                this.modalHeight = this.modalSubContainer.clientHeight;
                this.observer.observe(this.modalSubContainer);
            } else {
                this.modalHeight = 0;
                this.observer.unobserve(this.modalSubContainer);
            }
        }
    }

    @property({ type: Function })
    onClose = (): null => null;

    stopPropagation = (event: Event): void => {
        event.stopPropagation();
    };

    override render(): TemplateResult {
        return html`
            <div
                class="modal-container ${!this.open ? 'hidden' : ''}"
                @click=${this.onClose}
            >
                <div
                    class="modal ${this.mode} ${this.theme}"
                    @click=${this.stopPropagation}
                    style="height: ${this.modalHeight
                        ? `${this.modalHeight}px`
                        : 'auto'}"
                >
                    <div class="modal-sub-container">
                        <slot></slot>
                    </div>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vwk-base-modal': Modal;
    }
}
