import { World } from '@cucumber/cucumber';
import { BrowserContext, Page } from 'playwright';

export interface ICustomWorld extends World {
    context?: BrowserContext;
    page?: Page;
    openUrl: (url: string) => Promise<void>;
    click: (selector: string) => Promise<void>;
    clickByText: (text: string) => Promise<void>;
    isVisible: (selector: string) => Promise<void>;
    isVisibleByText: (text: string) => Promise<void>;
}
