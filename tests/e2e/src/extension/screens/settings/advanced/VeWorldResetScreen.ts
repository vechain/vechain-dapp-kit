import Locators from '../../../selenium/Locators';
import ScreenUtils from '../../../utils/ScreenUtils';
import { ROUTES } from '../../../enums';
import PasswordPrompt from '../../../screens/PasswordPrompt';
import TestDefaults from '../../../TestDefaults';
import { extension } from '../../../selenium/WebDriver';

const isActive = async () => {
    const locator = Locators.byDataTestId('appBarTitleId');
    return ScreenUtils.isActive([locator], ROUTES.SETTINGS_WALLET_RESET);
};

const confirmResetWallet = async () => {
    await extension.driver.waitAndClick(
        Locators.byDataTestId('confirmationCheckbox'),
    );
    await extension.driver.waitAndClick(Locators.byDataTestId('resetButton'));

    await PasswordPrompt.submitPassword(TestDefaults.PASSWORD);
};

export default {
    isActive,
    confirmResetWallet,
};
