import Locators from '../../../selenium/Locators';
import ScreenUtils from '../../../utils/ScreenUtils';
import { extension } from '../../../selenium/WebDriver';

const isActive = async () => {
    const locator = Locators.byId('addContactForm');
    return ScreenUtils.isActive([locator]);
};

const typeNewContact = async (name: string, address: string) => {
    await extension.driver.waitAndType(
        Locators.byDataTestId('aliasInput'),
        name,
    );
    await extension.driver.waitAndType(
        Locators.byDataTestId('addressInput'),
        address,
    );
};

const submit = async () => {
    await extension.driver.waitAndClick(Locators.byDataTestId('submit'));
};

export default {
    isActive,
    typeNewContact,
    submit,
};
