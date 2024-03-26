import Locators from '../selenium/Locators';
import ScreenUtils from '../utils/ScreenUtils';
import { extension } from '../selenium/WebDriver';

const isActive = async () => {
    const locator = Locators.byDataTestId('continueOnboardingButton');
    return ScreenUtils.isActive([locator]);
};

const navigateToPasswordSetup = async () => {
    //Navigate to the Setup Password screen
    await extension.driver.waitAndClick(
        Locators.byDataTestId('continueOnboardingButton'),
    );
    await extension.driver.waitAndClick(Locators.byId('skipButton'));
};

export default {
    isActive,
    navigateToPasswordSetup,
};
