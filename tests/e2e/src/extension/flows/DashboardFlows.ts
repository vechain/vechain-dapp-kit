import assert from 'assert';
import { ROUTES } from '../enums';
import ScreenUtils from '../utils/ScreenUtils';
import { extension } from '../selenium/WebDriver';
import Locators from '../selenium/Locators';
import NavigationUtils from '../utils/NavigationUtils';

const isActive = async () => {
    const locator = Locators.byId('yourBalanceTitle');
    return ScreenUtils.isActive([locator], ROUTES.DASHBOARD);
};

const lockApp = async () => {
    await extension.driver.waitAndClick(
        Locators.byDataTestId('top-nav-dropdown'),
    );
    await extension.driver.waitAndClick(Locators.byDataTestId('lockWallet'));
};

const goToDashboard = async () => {
    await NavigationUtils.goToExtension(ROUTES.DASHBOARD);
    await extension.driver.sleep(1_000);
    const isDashboardScreenActive = await isActive();
    assert(isDashboardScreenActive, 'The user is not on the dashboard screen');
};

const checkActiveAccount = async () => {
    const addressElement = await extension.driver.waitUntilElementEnabled(
        Locators.byId('AddressBoxAccountName'),
    );
    return await addressElement.getText();
};

const getCurrentNetwork = async () => {
    let currentNetwork;
    try {
        const bannerFlag = await extension.driver.waitUntilElementEnabled(
            Locators.byId('currentNetworkFlag'),
        );
        const currentNetworkPhrase = await bannerFlag.getText();
        currentNetwork = currentNetworkPhrase.split(': ')[1];
    } catch (error) {
        currentNetwork = '';
    }
    return currentNetwork.toLocaleLowerCase();
};

const checkConversionRate = async () => {
    try {
        await extension.driver.waitUntilElementEnabled(
            Locators.byId('exchangeRateConversionId'),
        );
        return true;
    } catch (error) {
        return false;
    }
};

const checkAccountBalance = async () => {
    return extension.driver.isElementPresent(
        Locators.byDataTestId('accountBalance'),
    );
};

const manuallyUpdateBalances = async () => {
    await goToDashboard();
    await extension.driver.waitAndClick(
        Locators.byDataTestId('updateBalances'),
    );
};

const checkTokenBalance = async (token: string) => {
    await goToDashboard();
    return extension.driver.isElementPresent(
        Locators.byDataTestId(`token-balance-${token}`),
    );
};

const countTransactionsByToken = async (token: string) => {
    await extension.driver.sleep(1000);
    await extension.driver.waitAndClick(Locators.byId('token-' + token));
    await extension.driver.sleep(2000);
    const transactionsCount = await extension.driver.findElements(
        Locators.byDataTestId('ft-activity'),
    );
    return transactionsCount.length;
};

const checkNewTransaction = async (token: string, oldCount: number) => {
    await extension.driver.sleep(1000);
    const newCount = await countTransactionsByToken(token);
    return newCount == oldCount + 1;
};

const changeAccount = async (accountNumber = '1') => {
    await extension.driver.waitAndClick(Locators.byId('AddressBoxAccountName'));
    await extension.driver.waitAndClick(
        Locators.byId(`account-checkbox-0-${accountNumber}`),
    );
};

const checkSecondAccountNotFound = async () => {
    let notFoundAccount = false;
    try {
        await extension.driver.waitAndClick(
            Locators.byDataTestId('addressTxt'),
        );
        await extension.driver.findElement(
            Locators.byId('account-checkbox-0-1'),
        );
    } catch (error) {
        notFoundAccount = true;
    }
    return notFoundAccount;
};

export default {
    isActive,
    lockApp,
    goToDashboard,
    checkActiveAccount,
    getCurrentNetwork,
    checkConversionRate,
    checkAccountBalance,
    manuallyUpdateBalances,
    checkTokenBalance,
    countTransactionsByToken,
    checkNewTransaction,
    checkSecondAccountNotFound,
    changeAccount,
};
