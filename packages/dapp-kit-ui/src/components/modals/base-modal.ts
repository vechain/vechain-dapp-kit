import type { PropertyValues, TemplateResult } from 'lit';
import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import {
    type ThemeMode,
    Breakpoint,
    Colors,
    modalBackdropFilter,
    modalWidth,
    modalZIndex,
} from '../../constants';

@customElement('vdk-base-modal')
export class BaseModal extends LitElement {
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
            background: rgba(0, 0, 0, 0.3);
            opacity: 1;
            transition: opacity 0.1s ease-in-out;
            z-index: var(--vdk-modal-z-index, ${modalZIndex});
            backdrop-filter: var(
                --vdk-modal-backdrop-filter,
                ${modalBackdropFilter}
            );
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
            background: var(
                --vdk-color-light-secondary,
                ${Colors.Light.Secondary}
            );
            color: var(--vdk-color-light-tertiary, ${Colors.Light.Tertiary});
        }

        .modal.DARK {
            background: var(
                --vdk-color-dark-secondary,
                ${Colors.Dark.Secondary}
            );
            color: var(--vdk-color-dark-tertiary, ${Colors.Dark.Tertiary});
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
                width: var(--vdk-modal-width, ${modalWidth});
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
                    class="modal ${this.mode}"
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
        'vdk-base-modal': BaseModal;
    }
}
