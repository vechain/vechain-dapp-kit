import assert from 'assert';
import { ROUTES } from '../enums';
import TokenTransferScreen from '../screens/token-transfer/TokenTransferScreen';
import NavigationUtils from '../utils/NavigationUtils';
import { extension } from '../selenium/WebDriver';
import Locators from '../selenium/Locators';
import PasswordPrompt from '../screens/PasswordPrompt';
import TestDefaults from '../TestDefaults';
import DashboardScreen from '../screens/DashboardScreen';

const sendToken = async (token: string, destinationAddress?: string) => {
    await NavigationUtils.goToExtension(ROUTES.SEND);
    await extension.driver.sleep(2000);
    const isActive = await TokenTransferScreen.isActive();
    assert(isActive, 'The user is not in the send screen');
    await TokenTransferScreen.buildTx(token, true, destinationAddress);
    await extension.driver.waitAndClick(
        Locators.byDataTestId('sendTransactionButton'),
    );
    await PasswordPrompt.submitPassword(TestDefaults.PASSWORD);
    await extension.driver.sleep(2000);
    await extension.driver.waitAndClick(Locators.byRole('pageClose'));
    await extension.driver.sleep(2000);
};

const receiveToken = async (token: string) => {
    await DashboardScreen.goToDashboard();
    await DashboardScreen.changeAccount('1');
    await sendToken(token, TestDefaults.ADDRESS);
    await DashboardScreen.goToDashboard();
    await DashboardScreen.changeAccount('0');
};

export default {
    sendToken,
    receiveToken,
};
