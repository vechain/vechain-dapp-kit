import Locators from '../../selenium/Locators';
import { ROUTES } from '../../enums';
import ScreenUtils from '../../utils/ScreenUtils';
import EditWalletScreen from './EditWalletScreen';
import assert from 'assert';
import TestDefaults from '../../TestDefaults';
import PasswordPrompt from '../PasswordPrompt';
import NavigationUtils from '../../utils/NavigationUtils';
import { extension } from '../../selenium/WebDriver';

const isActive = async () => {
    const locator = Locators.byId('accountsWalletManagementOptionsDescription');
    return ScreenUtils.isActive([locator], ROUTES.ACCOUNTS_WALLET_MANAGEMENT);
};

const checkWalletName = async (newWalletName: string) => {
    const addressElement = await extension.driver.waitUntilElement(
        Locators.byRole('device-alias'),
    );

    const walletNameToCheck = await addressElement.getText();
    return walletNameToCheck === newWalletName;
};

const checkNewAccountCreated = async (
    oldCountAccount: number,
    index: string,
) => {
    const newCountAccount = await countAccounts(index);
    return newCountAccount == oldCountAccount + 1;
};

const removeWallet = async () => {
    await extension.driver.sleep(1000);
    await extension.driver.waitAndClick(
        Locators.byId('GoToEditWalletPageButton1'),
    );

    const isEditWalletScreenActive = await EditWalletScreen.isActive();
    assert(
        isEditWalletScreenActive,
        'The user is not on the edit wallet screen',
    );

    await extension.driver.waitAndClick(
        Locators.byId('removeWalletButtonOnEditWalletPage'),
    );

    await extension.driver.waitAndClick(
        Locators.byId('confirmationCheckboxOnRemoveWalletPage'),
    );
    await extension.driver.waitAndClick(
        Locators.byId('removeWalletButtonOnRemoveWalletPage'),
    );

    await PasswordPrompt.submitPassword(TestDefaults.PASSWORD);
};

const tryToRemoveWallet = async () => {
    await extension.driver.waitAndClick(
        Locators.byId('GoToEditWalletPageButton0'),
    );

    let isEditWalletScreenActive = await EditWalletScreen.isActive();
    assert(
        isEditWalletScreenActive,
        'The user is not on the edit wallet screen',
    );

    await extension.driver.waitAndClick(
        Locators.byId('removeWalletButtonOnEditWalletPage'),
    );
};

const checkRemoveError = async () => {
    return await extension.driver.isElementPresent(
        Locators.byId('notAllowedToRemoveWalletError'),
    );
};

const goToWalletManagement = async () => {
    await NavigationUtils.goToExtension(ROUTES.ACCOUNTS_WALLET_MANAGEMENT);
    const isWalletManagementScreenActive = await isActive();
    assert(
        isWalletManagementScreenActive,
        'The user is not on the wallet management screen',
    );
};

const countAccounts = async (index: string) => {
    const accountCount = await extension.driver.findElements(
        Locators.byId('accountListElement-' + index),
    );
    return accountCount.length;
};

const hideAccount = async () => {
    const hideBtn = await extension.driver.waitUntilElementEnabled(
        Locators.byId('accountListElementDisable-0-1'),
    );
    await extension.driver.executeScript('arguments[0].click()', hideBtn);
    await extension.driver.sleep(3000);
};

export default {
    isActive,
    checkWalletName,
    checkNewAccountCreated,
    removeWallet,
    tryToRemoveWallet,
    checkRemoveError,
    goToWalletManagement,
    countAccounts,
    hideAccount,
};
