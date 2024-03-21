import assert from 'assert';
import { ROUTES } from '../../enums';
import Locators from '../../selenium/Locators';
import NavigationUtils from '../../utils/NavigationUtils';
import ScreenUtils from '../../utils/ScreenUtils';
import { extension } from '../../selenium/WebDriver';

const isActive = async function () {
    const locator = Locators.byId('networkManagementDescription');
    return ScreenUtils.isActive([locator], ROUTES.SETTINGS_NETWORKS);
};

const gotoNetworkManagement = async function () {
    await NavigationUtils.goToExtension(ROUTES.SETTINGS_NETWORKS);
    const isNetworkManagement = await isActive();
    assert(
        isNetworkManagement,
        'The user is not on the network management screen',
    );
};

const isNetworkActive = async (network: string) => {
    const networkElement = await extension.driver.waitUntilElement(
        Locators.byId(`network-option-${network}`),
    );

    return await networkElement.isDisplayed();
};

const changeNetwork = async function (network: string) {
    const networksDropdown = await extension.driver.waitUntilElementEnabled(
        Locators.byId('selectNetworkDropdown'),
    );
    await networksDropdown.click();
    const networksSelect = await extension.driver.waitUntilElementEnabled(
        Locators.byId(`network-option-${network}`),
    );
    await networksSelect.click();
};

const toggleIndicatorSwitch = async function () {
    const switchIndicator = await extension.driver.waitUntilElementEnabled(
        Locators.byId('showTestNetTagSwitch'),
    );
    await switchIndicator.click();
};

const toggleConversionSwitch = async function () {
    const switchIndicator = await extension.driver.waitUntilElementEnabled(
        Locators.byId('showConversionOtherNetsId'),
    );
    await switchIndicator.click();
};

export default {
    isActive,
    gotoNetworkManagement,
    changeNetwork,
    toggleIndicatorSwitch,
    toggleConversionSwitch,
    isNetworkActive,
};
