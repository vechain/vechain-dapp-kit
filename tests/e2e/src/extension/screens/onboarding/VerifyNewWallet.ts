import { ROUTES } from '../../enums';
import ScreenUtils from '../../utils/ScreenUtils';
import Locators from '../../selenium/Locators';
import { extension } from '../../selenium/WebDriver';

const isActive = async () => {
    const locator = Locators.byRole('confirmButton');
    return ScreenUtils.isActive([locator], ROUTES.NEW_LOCAL_WALLET);
};

const fillConfirmation = async (mnemonic: string[], valid: boolean) => {
    const mnemonicInputs = await extension.driver.waitUntilElements(
        Locators.byRole('mnemonic-input'),
    );

    if (valid) {
        for (const input of mnemonicInputs) {
            const dataTestId = await input.getAttribute('data-testid');
            await input.sendKeys(mnemonic[+dataTestId]);
        }
    } else {
        for (const input of mnemonicInputs) {
            await input.sendKeys(mnemonic[0]);
        }
    }
};

export const verifyMnemonic = async (valid: boolean) => {
    await extension.driver.waitAndClick(Locators.byRole('confirmButton'));

    if (valid)
        await extension.driver.waitAndClick(Locators.byRole('goToHomepage'));
};

export default {
    isActive,
    fillConfirmation,
    verifyMnemonic,
};
