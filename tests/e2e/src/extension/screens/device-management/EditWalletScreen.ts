import Locators from '../../selenium/Locators';
import { ROUTES } from '../../enums';
import ScreenUtils from '../../utils/ScreenUtils';
import { extension } from '../../selenium/WebDriver';

const isActive = async () => {
    const locator = Locators.byId('editWalletForm');
    return ScreenUtils.isActive([locator], ROUTES.ACCOUNTS_WALLET_EDIT);
};

const renameWallet = async (newWalletName: string) => {
    await extension.driver.waitAndClearAndType(
        Locators.byDataTestId('walletAlias'),
        newWalletName,
    );
    await extension.driver.waitAndClick(
        Locators.byId('saveChangesEditWalletButton'),
    );
};

export default {
    isActive,
    renameWallet,
};
