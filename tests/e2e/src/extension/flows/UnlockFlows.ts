import ScreenUtils from '../utils/ScreenUtils';
import Locators from '../selenium/Locators';
import { extension } from '../selenium/WebDriver';

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
