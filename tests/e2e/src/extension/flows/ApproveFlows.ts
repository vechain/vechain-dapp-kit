import NavigationUtils from '../utils/NavigationUtils';
import TestDefaults from '../TestDefaults';
import Locators from '../selenium/Locators';
import { extension } from '../selenium/WebDriver';
import PasswordFlows from './PasswordFlows';

const approveAndSign = async (password?: string) => {
    await approve();
    await sign(password);
};

const sign = async (password?: string) => {
    const pw = password || TestDefaults.PASSWORD;
    //Click the "Sign Cert" button
    await extension.driver.waitAndClick(Locators.byId('signCertificateButton'));
    await PasswordFlows.submitPassword(pw);
};

const approve = async () => {
    await NavigationUtils.switchToExtensionIframe();
    //Click Approve on "InitialAppApproval"
    await extension.driver.waitAndClick(
        Locators.byId('approve-app-request-btn'),
    );
};

export default {
    approveAndSign,
    approve,
    sign,
};
