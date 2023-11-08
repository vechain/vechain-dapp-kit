import playwright from 'playwright';
import { ICustomWorld } from 'types';

async function openUrl(this: ICustomWorld, url: string) {
    const browser = await playwright.chromium.launch({
        headless: false,
    });
    const context = await browser.newContext();
    this.page = await context.newPage();
    await this.page.goto(url);
}

export { openUrl };
