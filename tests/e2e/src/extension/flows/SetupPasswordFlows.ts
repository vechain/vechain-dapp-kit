import Locators from '../selenium/Locators';
import { ROUTES } from '../enums';
import ScreenUtils from '../utils/ScreenUtils';
import { extension } from '../selenium/WebDriver';

const isActive = async () => {
    const locator = Locators.byId('submitPasswordButton');
    return ScreenUtils.isActive([locator], ROUTES.SETUP_PASSWORD);
};

const enterPassword = async (password: string) => {
    await extension.driver.waitAndType(
        Locators.byId('passwordInput'),
        password,
    );
};

const enterConfirmPassword = async (confirmPassword: string) => {
    await extension.driver.waitAndType(
        Locators.byId('confirmPasswordInput'),
        confirmPassword,
    );
};

const submit = async () => {
    await extension.driver.waitAndClick(Locators.byId('submitPasswordButton'));
};

/**
 * Checks for next screen's elements
 */
const isPasswordSubmitted = async () => {
    return extension.driver.isElementPresent(
        Locators.byRole('goToImportWallet'),
    );
};

const navigateToImportWalletMnemonic = async () => {
    await extension.driver.waitAndClick(Locators.byRole('goToImportWallet'));
    await extension.driver.waitAndClick(
        Locators.byRole('goToImportLocalWallet'),
    );
    await extension.driver.waitAndClick(
        Locators.byRole('goToImportLocalWalletMnemonic'),
    );
};

const navigateToSetupNewWallet = async () => {
    await extension.driver.waitAndClick(Locators.byRole('goToCreateWallet'));
    await extension.driver.waitAndClick(Locators.byId('skipButton'));
};

export default {
    isActive,
    enterPassword,
    isPasswordSubmitted,
    enterConfirmPassword,
    submit,
    navigateToImportWalletMnemonic,
    navigateToSetupNewWallet,
};
