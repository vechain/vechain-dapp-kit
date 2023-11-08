import { ICustomWorld } from 'types';

function isVisible(this: ICustomWorld, selector: string) {
    return this.page?.locator(selector).first().isVisible();
}

function isVisibleByText(this: ICustomWorld, text: string) {
    return isVisible.bind(this)(`text=${text}`);
}

export { isVisible, isVisibleByText };
