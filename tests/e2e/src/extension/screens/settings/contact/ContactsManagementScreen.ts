import Locators from '../../../selenium/Locators';
import ScreenUtils from '../../../utils/ScreenUtils';
import { extension } from '../../../selenium/WebDriver';

const isActive = async () => {
    const locator = Locators.byId('addContactBtn');
    return ScreenUtils.isActive([locator]);
};

const addContact = async () => {
    await extension.driver.waitAndClick(Locators.byId('addContactBtn'));
};

// Used both to assert presence/absence of element
const isContactAliasVisible = async (alias: string, logException: boolean) => {
    await extension.driver.sleep(1000);
    try {
        const contactElement = await extension.driver.waitUntilElement(
            Locators.byDataTestId(`contact-alias-${alias}`),
        );
        const contactTitle = await contactElement.getText();
        return alias === contactTitle;
    } catch (e) {
        if (logException) console.log(e);
        return false;
    }
};

const clickEdit = async (alias: string) => {
    await extension.driver.sleep(1000);
    await extension.driver.waitAndClick(
        Locators.byDataTestId(`contact-update-${alias}`),
    );
};

export default {
    isActive,
    addContact,
    isContactAliasVisible,
    clickEdit,
};
