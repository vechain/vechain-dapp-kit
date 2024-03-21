import Locators from '../../../selenium/Locators';
import ScreenUtils from '../../../utils/ScreenUtils';
import NavigationUtils from '../../../utils/NavigationUtils';
import { ROUTES } from '../../../enums';
import { By, WebElement } from 'selenium-webdriver';
import { asyncFilter } from '../../../utils/AsyncUtils/AsyncUtils';
import { extension } from '../../../selenium/WebDriver';

const isActive = async () => {
    const locator = Locators.byDataTestId('appBarTitleId');
    return ScreenUtils.isActive([locator], ROUTES.SETTINGS_GENERAL);
};

const getSelectedLanguage = async () => {
    const languageSelector = extension.driver.findElement(
        Locators.byId('languageDropdownId'),
    );
    return languageSelector.getText();
};

const changeLanguage = async (newLanguage: string) => {
    const oldLanguageElement = await extension.driver.waitUntilElementEnabled(
        Locators.byId('languageDropdownId'),
    );
    await oldLanguageElement.click();

    const newLanguageElement = await extension.driver.waitUntilElementEnabled(
        Locators.byDataTestId(`option-language-${toLanguageCode(newLanguage)}`),
    );
    await newLanguageElement.click();
};

const isScreenTranslated = async (language: string) => {
    const element = await extension.driver.waitUntilElement(
        Locators.byDataTestId('appBarTitleId'),
    );
    const title = await element.getText();
    return language === toLanguage(title);
};

const getSelectedCurrency = async () => {
    const languageSelector = extension.driver.findElement(
        Locators.byId('currencyDropdownId'),
    );
    const selectedCurrency = await languageSelector.getText();
    return toCurrencyCode(selectedCurrency);
};

const changeCurrency = async (newCurrency: string) => {
    const oldCurrencyElement = await extension.driver.waitUntilElementEnabled(
        Locators.byId('currencyDropdownId'),
    );
    await oldCurrencyElement.click();

    const newCurrencyElement = await extension.driver.waitUntilElementEnabled(
        Locators.byDataTestId(`option-currency-${newCurrency}`),
    );
    await newCurrencyElement.click();
};

// Modify network setting to show fiat balance for testnet before checking dashboard currencies
const isConversionInCurrency = async (currency: string) => {
    await NavigationUtils.goToExtension(ROUTES.SETTINGS_NETWORKS);
    const showConversionElement =
        await extension.driver.waitUntilElementEnabled(
            Locators.byDataTestId('showConversionOtherNetsId'),
        );
    await showConversionElement.click();

    await NavigationUtils.goToExtension(ROUTES.DASHBOARD);
    const fiatBalanceElement = await extension.driver.waitUntilElementEnabled(
        Locators.byDataTestId('fiat-balance-VET'),
    );
    const fiatBalanceText = await fiatBalanceElement.getText();
    return fiatBalanceText.includes(toCurrencySymbol(currency));
};

const toggleHideTokensNoBalance = async () => {
    const isChecked = await extension.driver.isElementChecked(
        Locators.byDataTestId('token-no-balance-switch'),
    );
    if (!isChecked) {
        await extension.driver.waitAndClick(
            Locators.byDataTestId('token-no-balance-switch'),
        );
    }
};

const areTokenNoBalanceInvisible = async () => {
    await NavigationUtils.goToExtension(ROUTES.DASHBOARD);
    const balances = await extension.driver.findElements(
        By.xpath("//span[starts-with(@data-testid, 'token-balance-')]"),
    );

    const noBalanceTokens = await asyncFilter(
        balances,
        async (b: WebElement) => {
            const v = await b.getText();
            return v.split(' ')[0] == '0';
        },
    );
    return noBalanceTokens.length === 0;
};

const toLanguage = (label: string) => {
    switch (label) {
        case 'General':
            return 'English (United States)';
        case 'Général':
            return 'French (France)';
        default:
            return 'unknown';
    }
};

const toLanguageCode = (language: string) => {
    switch (language) {
        case 'English (United States)':
            return 'en-US';
        case 'English (Great Britain)':
            return 'en-GB';
        case 'French (France)':
            return 'fr-FR';
        default:
            return 'unknown';
    }
};

const toCurrencyCode = (currency: string) => {
    switch (currency) {
        case 'USD - Dollar (US)':
            return 'USD';
        case 'EUR - Euro':
            return 'EUR';
        default:
            return 'unknown';
    }
};

const toCurrencySymbol = (currency: string) => {
    switch (currency) {
        case 'USD':
            return '$';
        case 'EUR':
            return '€';
        default:
            return 'unknown';
    }
};

export default {
    isActive,
    getSelectedLanguage,
    changeLanguage,
    isScreenTranslated,
    getSelectedCurrency,
    changeCurrency,
    isConversionInCurrency,
    toggleHideTokensNoBalance,
    areTokenNoBalanceInvisible,
};
