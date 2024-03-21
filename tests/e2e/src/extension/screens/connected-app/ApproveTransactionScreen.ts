import TestDefaults from '../../TestDefaults';
import NavigationUtils from '../../utils/NavigationUtils';
import PasswordPrompt from '../PasswordPrompt';
import Locators from '../../selenium/Locators';
import { extension } from '../../selenium/WebDriver';

const approve = async (password?: string) => {
    const pw = password || TestDefaults.PASSWORD;

    await NavigationUtils.switchToExtensionIframe();
    //Wait for loader screen to disappear
    await extension.driver.sleep(1500);
    await extension.driver.waitAndClick(
        Locators.buttonByName('sendTransactionButton'),
    );
    await PasswordPrompt.submitPassword(pw);
};

const reject = async () => {
    await NavigationUtils.switchToExtensionIframe();
    await extension.driver.sleep(1000);
    await extension.driver.waitAndClick(Locators.byDataTestId('rejectDappBtn'));
};

export default {
    approve,
    reject,
};
