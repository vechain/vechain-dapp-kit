import { ROUTES } from '../../enums';
import ScreenUtils from '../../utils/ScreenUtils';
import Locators from '../../selenium/Locators';
import { extension } from '../../selenium/WebDriver';

const isActive = async () => {
    const locator = Locators.byId('copyMnemonicPrompt');
    return ScreenUtils.isActive([locator], ROUTES.NEW_LOCAL_WALLET);
};

const copyMnemonic = async (): Promise<string[]> => {
    const mnemonic: string[] = [];

    for (let i = 0; i < 12; i++) {
        const mnemonicElement = await extension.driver.waitUntilElement(
            Locators.byId(`mnemonic-word-${i}`),
        );
        mnemonic.push(await mnemonicElement.getText());
    }

    console.log(mnemonic);

    return mnemonic;
};

const proceedAfterCopy = async () => {
    await extension.driver.waitAndClick(Locators.byId('confirmSavedCheckbox'));
    await extension.driver.waitAndClick(Locators.byId('proceedButton'));
};

export default {
    isActive,
    copyMnemonic,
    proceedAfterCopy,
};
