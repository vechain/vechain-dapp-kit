import Locators from '../../selenium/Locators';
import TestDefaults from '../../TestDefaults';
import { ROUTES } from '../../enums';
import ScreenUtils from '../../utils/ScreenUtils';
import { extension } from '../../selenium/WebDriver';

const isActive = async () => {
    const locator = Locators.byDataTestId('importLocalWalletPrivateKeyButton');
    return ScreenUtils.isActive(
        [locator],
        ROUTES.IMPORT_LOCAL_WALLET_PRIVATEKEY,
    );
};

const enterPrivateKey = async (privateKey?: string) => {
    privateKey = privateKey || TestDefaults.PRIVATE_KEY;

    await extension.driver.waitAndType(
        Locators.byDataTestId(`private-key`),
        privateKey,
    );
};

const submit = async () => {
    await extension.driver.waitAndClick(
        Locators.byDataTestId('importLocalWalletPrivateKeyButton'),
    );
};

export default {
    isActive,
    enterPrivateKey,
    submit,
};
