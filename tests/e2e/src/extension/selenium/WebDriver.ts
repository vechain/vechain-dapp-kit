import util from 'util';
import { exec as execSync } from 'child_process';
import * as path from 'path';
import * as console from 'console';
import * as chrome from 'selenium-webdriver/chrome';
import { Key, logging, until, WebDriver, WebElement } from 'selenium-webdriver';
import { By } from 'selenium-webdriver/lib/by';
import { Mutex } from 'async-mutex';
import { ShadowRoot } from 'selenium-webdriver/lib/webdriver';
import { ROUTES } from '../enums';
import TestDefaults from '../TestDefaults';
import Locators from './Locators';

const exec = util.promisify(execSync);

let globalWebDriver: ExtensionDriver | undefined;

export const extension = {
    get driver(): ExtensionDriver {
        if (!globalWebDriver) throw new Error('WebDriver not initialized');
        return globalWebDriver;
    },
};

export const quitWebDriver = async () => {
    try {
        await globalWebDriver?.quit();
    } catch (e) {
        console.error('Failed to quit WebDriver', e);
    }
};

export const resetWebDriver = async (startupTimeout?: number) => {
    await quitWebDriver();
    globalWebDriver = undefined;
    await buildWebDriver(startupTimeout);
};

const buildMutex = new Mutex();

export const buildWebDriver = async (
    startupTimeout?: number,
): Promise<ExtensionDriver> => {
    return buildMutex.runExclusive(async () => {
        if (globalWebDriver) return globalWebDriver;

        const extensionPath = path.join(
            __dirname,
            '..',
            '..',
            '..',
            'veworld-dist',
        );

        console.log('Building web driver...', extensionPath);
        const options = new chrome.Options();

        const prefs = new logging.Preferences();
        prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
        options.setLoggingPrefs(prefs);

        options.addArguments(`load-extension=${extensionPath}`);
        options.addArguments('window-size=1920,1080');

        if (process.env.SELENIUM_HEADLESS) {
            options.addArguments('--headless=new');
            options.addArguments('--no-sandbox');
        }

        const { stdout, stderr } = await exec('which chromedriver');

        if (stderr) {
            throw new Error("Could not find executable 'chromedriver'");
        }

        const service = new chrome.ServiceBuilder(stdout.trim()).build();

        const driver = chrome.Driver.createSession(options, service);
        await driver.manage().setTimeouts({ implicit: TestDefaults.TIMEOUT });

        const session = await driver.getSession();
        const executor = driver.getExecutor();
        const extensionDriver = new ExtensionDriver(session, executor);

        globalWebDriver = extensionDriver;

        //Bug running interactive tests with mv3
        if (startupTimeout) {
            console.log('Sleeping for timeout: ', startupTimeout);
            await extensionDriver.sleep(startupTimeout);
        }

        return extensionDriver;
    });
};

export class ExtensionDriver extends WebDriver {
    private extensionUrl: string | undefined;

    public switchToExtensionIframe = async () => {
        console.log('Looking for VeWorld Outer Container');
        const veWorldContainer = await this.waitUntilElement(
            Locators.byId('veworld-outer-container'),
        );
        const outerShadowRoot = await this.waitUntilShadowRoot(
            veWorldContainer,
        );

        console.log('Looking for VeWorld Inner Container');
        const innerContainer = await this.waitUntilShadowRootElement(
            outerShadowRoot,
            By.id('veworld-inner-container'),
        );
        const innerShadowRoot = await this.waitUntilShadowRoot(innerContainer);

        console.log('Looking for VeWorld Iframe element');
        const veWorldFrame = await this.waitUntilShadowRootElement(
            innerShadowRoot,
            By.id('veworld-frame'),
        );
        await this.switchTo().frame(veWorldFrame);
    };

    public waitUntilShadowRoot = async (
        element: WebElement,
    ): Promise<ShadowRoot> => {
        const sleepTime = 2000;
        for (let i = 0; i < 30000 / sleepTime; i++) {
            try {
                return await element.getShadowRoot();
            } catch (e) {
                await this.sleep(sleepTime);
            }
        }
        const id = await element.getId();
        throw Error(
            `Timed out searching for shadow root on element with ID: ${id}`,
        );
    };

    public waitUntilLocatorShadowRoot = async (
        locator: By,
    ): Promise<ShadowRoot> => {
        const sleepTime = 200;
        for (let i = 0; i < TestDefaults.TIMEOUT / sleepTime; i++) {
            try {
                const element = await this.waitUntilElement(locator);
                return await element.getShadowRoot();
            } catch (e) {
                await this.sleep(sleepTime);
            }
        }
        throw Error(
            `Timed out searching for shadow root on locator: ${locator.toString()}`,
        );
    };

    public scrollIntoView = async (elementId: string) => {
        try {
            await this.waitUntilElement(Locators.byId(elementId));
            await this.executeScript(
                `document.getElementById('${elementId}').scrollIntoView(true)`,
            );

            // Wait for scroll animation to finish
            await this.wait(
                async () => {
                    const scrollPosition = await this.executeScript(
                        'return window.pageYOffset;',
                    );
                    await this.sleep(100);
                    const newScrollPosition = await this.executeScript(
                        'return window.pageYOffset;',
                    );
                    return scrollPosition === newScrollPosition;
                },
                5000,
                'Scroll animation did not finish',
            );
        } catch (e) {
            console.error(
                `Failed to scroll into view for element ID: ${elementId}`,
                e,
            );
            throw e;
        }
    };

    public waitUntilShadowRootElement = async (
        shadowRoot: ShadowRoot,
        locator: By,
    ): Promise<WebElement> => {
        const sleepTime = 200;
        for (let i = 0; i < TestDefaults.TIMEOUT / sleepTime; i++) {
            try {
                return await shadowRoot.findElement(locator);
            } catch (e) {
                await this.sleep(sleepTime);
            }
        }
        throw Error(`Could not find the shadow root element: ${locator.value}`);
    };

    public waitAndClick = async (locator: By) => {
        const element = await this.waitUntilElementEnabled(locator);
        await element.click();
    };

    public waitUntilElementEnabled = async (
        locator: By,
        timeout = TestDefaults.TIMEOUT,
    ) => {
        console.log('Waiting for element to be enabled: ', locator.value);
        const element = await this.waitUntilElement(locator);
        return this.wait(
            until.elementIsEnabled(element),
            timeout,
            `Timed out waiting element to be enabled  ${locator.value}`,
        );
    };

    public waitUntilElementRemoved = async (
        locator: By,
        timeout = TestDefaults.TIMEOUT,
    ) => {
        const sleepTime = 200;
        for (let i = 0; i < timeout / sleepTime; i++) {
            try {
                await this.findElement(locator);
            } catch (e) {
                return;
            }
            await this.sleep(sleepTime);
        }
        throw Error(
            `Timed out waiting for element to be removed: ${locator.value}`,
        );
    };

    public waitAndType = async (locator: By, text: string) => {
        const element = await this.waitUntilElementEnabled(locator);
        await element.sendKeys(text);
    };

    public waitAndClearAndType = async (locator: By, text: string) => {
        const element = await this.waitUntilElementEnabled(locator);

        await element.click();
        await this.executeScript(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (e: { select: () => any }) => e.select(),
            element,
        );
        await element.sendKeys(Key.BACK_SPACE);
        await element.sendKeys(text);
        await element.sendKeys(Key.TAB);
    };

    public waitUntilElement = async (
        locator: By,
        timeout = TestDefaults.TIMEOUT,
        debug = false,
    ): Promise<WebElement> => {
        try {
            return await this.wait(
                until.elementLocated(locator),
                timeout,
                `Timed out waiting until element located by: ${
                    locator.value
                } on page: ${
                    debug ? await this.getPageSource() : 'NOT LOGGED'
                }`,
            );
        } catch (e) {
            console.log(`Timed out waiting for element ${locator.value}`);
            throw e;
        }
    };

    public waitUntilElements = async (
        locator: By,
        timeout = TestDefaults.TIMEOUT,
        debug = false,
    ): Promise<WebElement> => {
        try {
            return await this.wait(
                until.elementsLocated(locator),
                timeout,
                `Timed out waiting until elements located by: ${
                    locator.value
                } on page: ${
                    debug ? await this.getPageSource() : 'NOT LOGGED'
                }`,
            );
        } catch (e) {
            console.log(`Timed out waiting for element ${locator.value}`);
            throw e;
        }
    };

    public isElementPresent = async (locator: By): Promise<boolean> => {
        try {
            await extension.driver.waitUntilElement(locator);
            return true;
        } catch (e) {
            console.log(e);
        }
        return false;
    };

    public isElementChecked = async (locator: By): Promise<boolean> => {
        const element = await extension.driver.waitUntilElementEnabled(locator);
        const value = await element.getAttribute('aria-checked');
        return value === 'true';
    };

    public navigateToExtension = async (route?: ROUTES): Promise<void> => {
        const baseUrl = await this.getBaseUrl();
        const url = route ? `${baseUrl}${route}` : baseUrl;
        console.log(`Navigating to URL: ${url}`);
        await this.get(url);
    };

    /**
     * This method is built on the assumption that our extension is the only one existing
     */
    public getBaseUrl = async (): Promise<string> => {
        if (this.extensionUrl) return this.extensionUrl;

        await this.get('chrome://extensions');

        const extensionId: string = await this.executeScript(`
      return document.querySelector("extensions-manager").shadowRoot
        .querySelector("extensions-item-list").shadowRoot
        .querySelector("extensions-item").getAttribute("id")
    `);

        this.extensionUrl = `chrome-extension://${extensionId}/index.html#`;

        return this.extensionUrl;
    };
}
