import assert from 'assert';
import { ROUTES } from '../../enums';
import Locators from '../../selenium/Locators';
import NavigationUtils from '../../utils/NavigationUtils';
import ScreenUtils from '../../utils/ScreenUtils';
import { extension } from '../../selenium/WebDriver';

const isActive = async function () {
    const locator = Locators.byId('addNetworkDescription');
    return ScreenUtils.isActive([locator], ROUTES.SETTINGS_NETWORK_ADD);
};

const gotoAddNetwork = async function () {
    await NavigationUtils.goToExtension(ROUTES.SETTINGS_NETWORK_ADD);
    const isNetworkManagement = await isActive();
    assert(isNetworkManagement, 'The user is not on the add network screen');
};

const addNetworkWithWrongUrl = async function () {
    await extension.driver.waitAndType(
        Locators.byId('networkNameInput'),
        'test',
    );
    await extension.driver.waitAndType(
        Locators.byId('networkUrlInput'),
        'test',
    );
    await extension.driver.waitAndClick(Locators.byId('submitAddEditNetwork'));
};

const checkError = async function () {
    assert(isActive, 'The user should be on the add network screen');
    try {
        await extension.driver.waitUntilElementEnabled(
            Locators.byClass('input-error'),
        );
        return true;
    } catch (error) {
        return false;
    }
};

export default {
    isActive,
    gotoAddNetwork,
    addNetworkWithWrongUrl,
    checkError,
};
