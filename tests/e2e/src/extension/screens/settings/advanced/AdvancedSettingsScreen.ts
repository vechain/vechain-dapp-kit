import Locators from '../../../selenium/Locators';
import ScreenUtils from '../../../utils/ScreenUtils';
import { ROUTES } from '../../../enums';
import { extension } from '../../../selenium/WebDriver';
import NavigationUtils from '../../../utils/NavigationUtils';

const isActive = async () => {
    const locator = Locators.byDataTestId('appBarTitleId');
    return ScreenUtils.isActive([locator], ROUTES.SETTINGS_GENERAL);
};

const downloadStateLog = async () => {
    await extension.driver.waitAndClick(Locators.byDataTestId('downloadLogId'));
};

const checkDownloadSuccess = async () => {
    try {
        const notification = await extension.driver.waitUntilElementEnabled(
            Locators.byClass('ant-notification-notice-description'),
        );
        const msg = await notification.getText();
        if (msg === 'State logs download successful') return true;
    } catch (e) {
        console.error(e);
    }
    return false;
};

const clickResetExtension = async () => {
    await NavigationUtils.goToExtension(ROUTES.SETTINGS_WALLET_RESET);
};

export default {
    isActive,
    downloadStateLog,
    checkDownloadSuccess,
    clickResetExtension,
};
