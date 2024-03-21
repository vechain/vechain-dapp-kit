import Locators from 'extension/selenium/Locators';
import { extension } from 'extension/selenium/WebDriver';
import ScreenUtils from 'extension/utils/ScreenUtils';

const passwordInput = () => Locators.byDataTestId('password-input');
const submitButton = () => Locators.byDataTestId('unlock-button');

const isActive = async () => {
    return ScreenUtils.isActive([
        passwordInput(),
        submitButton(),
        Locators.byForm('unlockWalletForm'),
    ]);
};

const submitPassword = async (password: string) => {
    await extension.driver.waitAndType(passwordInput(), password);
    await extension.driver.waitAndClick(submitButton());
};

export default {
    isActive,
    submitPassword,
};
