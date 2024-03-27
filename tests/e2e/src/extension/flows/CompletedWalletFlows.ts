import Locators from '../selenium/Locators';
import { ROUTES } from '../enums';
import ScreenUtils from '../utils/ScreenUtils';
import { extension } from '../selenium/WebDriver';

const isActive = async () => {
    const locator = Locators.byId('goToHomepage');
    return ScreenUtils.isActive([locator], ROUTES.COMPLETED_WALLET);
};

const navigateToDashboard = async () => {
    await extension.driver.waitAndClick(Locators.byId('goToHomepage'));
};

export default {
    isActive,
    navigateToDashboard,
};
