import Locators from '../../../selenium/Locators';
import ScreenUtils from '../../../utils/ScreenUtils';
import { compareAddresses } from '../../../utils/AddressUtils/AddressUtils';
import { extension } from '../../../selenium/WebDriver';

const isActive = async () => {
    const locator = Locators.byId('addEditContactForm');
    return ScreenUtils.isActive([locator]);
};

const typeAlias = async (newName: string) => {
    let closeToast;
    try {
        closeToast = await extension.driver.findElement(
            Locators.byClass('anticon anticon-close'),
        );
    } finally {
        if (closeToast) await closeToast.click();

        await extension.driver.sleep(1000);
        await extension.driver.waitAndClearAndType(
            Locators.byId('aliasInput'),
            newName,
        );
    }
};

const typeAddress = async (newAddress: string) => {
    await extension.driver.waitAndClearAndType(
        Locators.byId('addressInput'),
        newAddress,
    );
};

const update = async () => {
    await extension.driver.waitAndClick(Locators.byDataTestId('update'));
};

const checkAddressUpdated = async (address: string) => {
    const addressInput = await extension.driver.findElement(
        Locators.byId('addressInput'),
    );
    const inputValue = await addressInput.getAttribute('value');
    return compareAddresses(inputValue, address);
};

const isErrorMessageDisplayed = async () => {
    const element = await extension.driver.findElement(
        Locators.byClass('input-error'),
    );
    const value = await element.getText();
    return (
        value === 'Required' || value === 'Please enter a valid Vechain address'
    );
};

const remove = async () => {
    await extension.driver.waitAndClick(Locators.byDataTestId('remove'));
};

export default {
    isActive,
    typeAlias,
    typeAddress,
    update,
    checkAddressUpdated,
    isErrorMessageDisplayed,
    remove,
};
