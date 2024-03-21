import { extension } from '../../selenium/WebDriver';
import Locators from '../../selenium/Locators';
import ScreenUtils from '../../utils/ScreenUtils';
import { ROUTES } from '../../enums';
import PasswordPrompt from '../PasswordPrompt';
import TestDefaults from '../../TestDefaults';
import NavigationUtils from '../../utils/NavigationUtils';
import { Key } from 'selenium-webdriver';

const isActive = async () => {
    const locator = Locators.byDataTestId('appBarTitleId');
    return ScreenUtils.isActive([locator], ROUTES.SEND);
};

const hasSufficientFunds = async (token: string) => {
    const balanceElement = await extension.driver.findElement(
        Locators.byDataTestId(`token-balance-${token}`),
    );
    const balanceText = await balanceElement.getText();
    return balanceText.split(' ')[0] != '0';
};

const buildTx = async (
    token: string,
    lessThanBalance: boolean,
    destinationAddress?: string,
) => {
    await extension.driver.waitAndClick(
        Locators.byDataTestId(`token-balance-${token}`),
    );

    await extension.driver.waitAndClick(
        Locators.byClass('react-select__value-container'),
    );

    await extension.driver.waitAndType(
        Locators.byId('searchInput'),
        destinationAddress
            ? destinationAddress
            : '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68',
    );

    const element = await extension.driver.waitUntilElementEnabled(
        Locators.byId('searchInput'),
    );
    await element.sendKeys(Key.ENTER);

    await extension.driver.waitAndType(
        Locators.byId('amountToTransfer'),
        lessThanBalance ? '1' : '100000000000',
    );
    await extension.driver.waitAndClick(Locators.byDataTestId('sendTokenBtn'));
};

const buildAndSendTx = async (
    receiver = '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68',
    delegate = false,
) => {
    await buildTx('VET', true, receiver);

    if (delegate) await selectAccountDelegation();

    //Wait for loader screen to disappear
    await extension.driver.sleep(1500);
    await extension.driver.waitAndClick(
        Locators.buttonByName('sendTransactionButton'),
    );
    await PasswordPrompt.submitPassword(TestDefaults.PASSWORD);
    await NavigationUtils.goToExtension(ROUTES.DASHBOARD);
};

const submitTx = async () => {
    //Wait for loader screen to disappear
    await extension.driver.sleep(1500);
    await extension.driver.waitAndClick(
        Locators.buttonByName('sendTransactionButton'),
    );
    await PasswordPrompt.submitPassword(TestDefaults.PASSWORD);
    await NavigationUtils.goToExtension(ROUTES.DASHBOARD);
};

const isTransferConfirmationShown = async (route: ROUTES) => {
    const locator = Locators.byId('sendTokenConfirm');
    return ScreenUtils.isActive([locator], route);
};

const isTransferErrorShown = async () => {
    return await extension.driver.isElementPresent(
        Locators.byClass('input-error'),
    );
};

const selectForCrossAccountDelegation = async () => {
    const accountRadioId = 'option-ACCOUNT';

    // Wait for the footer to be rendered in the DOM
    await extension.driver.waitUntilElement(
        Locators.byClass('spacer-y footer-sticky'),
    );

    await extension.driver.scrollIntoView(accountRadioId);

    await extension.driver.waitAndClick(Locators.byId(accountRadioId));
    await extension.driver.waitAndClick(Locators.byId('account-checkbox-0-2'));
};

const selectAccountDelegation = async () => {
    const accountRadioId = 'option-ACCOUNT';

    await extension.driver.scrollIntoView(accountRadioId);
    await extension.driver.waitAndClick(Locators.byId(accountRadioId));
    await extension.driver.waitAndClick(Locators.byId('account-checkbox-0-2'));
};

export default {
    isActive,
    hasSufficientFunds,
    buildTx,
    isTransferConfirmationShown,
    isTransferErrorShown,
    buildAndSendTx,
    selectAccountDelegation,
    selectForCrossAccountDelegation,
    submitTx,
};
