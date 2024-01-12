import { ICustomWorld } from 'types';

async function click(this: ICustomWorld, selector: string) {
    await this.page?.click(selector);
}

async function clickByText(this: ICustomWorld, text: string) {
    await click.bind(this)(`text=${text}`);
}

export { click, clickByText };
