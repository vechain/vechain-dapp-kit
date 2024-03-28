import { ROUTES } from '../enums';
import { By } from 'selenium-webdriver/lib/by';
import { extension } from '../selenium/WebDriver';

const isActive = async (locators: By[], route?: ROUTES): Promise<boolean> => {
    try {
        for (const locator of locators) {
            await extension.driver.waitUntilElement(locator);
        }

        const url = await extension.driver.getCurrentUrl();

        if (route) {
            return url.endsWith(route);
        }

        return true;
    } catch (e) {
        console.log(e);
        console.warn(`Screen is not active on route ${route}`, locators);
        return false;
    }
};

export default {
    isActive,
};
