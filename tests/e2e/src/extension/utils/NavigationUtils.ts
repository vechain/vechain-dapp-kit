import { ROUTES } from '../enums';
import { extension } from '../selenium/WebDriver';

const goToExtension = async (route?: ROUTES) => {
    await extension.driver.navigateToExtension(route);
    await extension.driver.sleep(1000);
};

/**
 * @returns the window handle of the given URL
 */
const goToUrl = async (url: string): Promise<string> => {
    await extension.driver.get(url);
    await extension.driver.sleep(1000);
    return extension.driver.getWindowHandle();
};

const switchToExtensionIframe = async () => {
    await extension.driver.switchToExtensionIframe();
};

const switchToWindow = async (windowHandle: string) => {
    await extension.driver.switchTo().window(windowHandle);
};

export default {
    goToExtension,
    goToUrl,
    switchToExtensionIframe,
    switchToWindow,
};
