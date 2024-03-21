import Locators from '../../selenium/Locators';
import TestDefaults from '../../TestDefaults';
import { ROUTES } from '../../enums';
import ScreenUtils from '../../utils/ScreenUtils';
import { extension } from '../../selenium/WebDriver';
import path from 'path';

const isActive = async () => {
    const locator = Locators.byDataTestId('importLocalWalletKeystoreButton');
    return ScreenUtils.isActive([locator], ROUTES.IMPORT_LOCAL_WALLET_KEYSTORE);
};

const uploadKeystore = async (
    keystorePath?: string,
    keystorePassword?: string,
) => {
    keystorePath = keystorePath || TestDefaults.KEYSTORE_PATH;
    keystorePassword = keystorePassword || TestDefaults.KEYSTORE_PASSWORD;

    const keystoreAbsolutePath = path.resolve(keystorePath);

    await extension.driver.waitAndType(
        Locators.byDataTestId(`input-keystore-file`),
        keystoreAbsolutePath,
    );

    await extension.driver.waitAndType(
        Locators.byDataTestId(`keystore-password`),
        keystorePassword,
    );
};

const submit = async () => {
    await extension.driver.waitAndClick(
        Locators.byDataTestId('importLocalWalletKeystoreButton'),
    );
};

export default {
    isActive,
    uploadKeystore,
    submit,
};
