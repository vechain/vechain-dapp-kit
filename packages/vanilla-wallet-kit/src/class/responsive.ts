import { LitElement } from 'lit';
import { property } from 'lit/decorators';
import { addResizeListeners } from '../utils';
import { Breakpoint } from '../constants';

export enum Media {
    Mobile = 'mobile',
    Tablet = 'tablet',
    Desktop = 'desktop',
}

export class ResponsiveLitElement extends LitElement {
    @property()
    media = Media.Desktop;

    private setCurrentMedia = (): void => {
        if (window.screen.width <= Breakpoint.Mobile) {
            this.media = Media.Mobile;
            return;
        }
        if (window.screen.width <= Breakpoint.Tablet) {
            this.media = Media.Tablet;
            return;
        }
        this.media = Media.Desktop;
    };

    constructor() {
        super();
        addResizeListeners(this.setCurrentMedia);
    }
}
