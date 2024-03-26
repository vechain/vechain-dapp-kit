import Locators from '../selenium/Locators';
import TestDefaults from '../TestDefaults';
import { ROUTES } from '../enums';
import ScreenUtils from '../utils/ScreenUtils';
import { extension } from '../selenium/WebDriver';

const isActive = async () => {
    const locator = Locators.byDataTestId('importLocalWalletMnemonicButton');
    return ScreenUtils.isActive([locator], ROUTES.IMPORT_LOCAL_WALLET_MNEMONIC);
};

const enterMnemonic = async (mnemonic?: string | string[]) => {
    mnemonic = mnemonic || TestDefaults.MNEMONIC;

    if (typeof mnemonic === 'string') {
        mnemonic = mnemonic.split(' ');
    }

    for (let index = 0; index < mnemonic.length; index++) {
        await extension.driver.waitAndType(
            Locators.byDataTestId(`mnemonic-word-${index}`),
            mnemonic[index],
        );
    }
};

const submit = async () => {
    await extension.driver.waitAndClick(
        Locators.byDataTestId('importLocalWalletMnemonicButton'),
    );
};

export default {
    isActive,
    enterMnemonic,
    submit,
};
