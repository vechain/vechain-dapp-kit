import { extension } from '../../selenium/WebDriver';
import Locators from '../../selenium/Locators';
import ScreenUtils from '../../utils/ScreenUtils';
import { ROUTES } from '../../enums';
import NavigationUtils from '../../utils/NavigationUtils';
import assert from 'assert';

const isActive = async () => {
    const locator = Locators.byDataTestId('appBarTitleId');
    return ScreenUtils.isActive([locator], ROUTES.ACTIVITIES);
};

const goToActivities = async () => {
    await extension.driver.sleep(500);
    await NavigationUtils.goToExtension(ROUTES.ACTIVITIES);
};

const isTokenTransferLogged = async (isSent: boolean) => {
    const elements = await extension.driver.findElements(
        Locators.byDataTestId('ft-activity'),
    );
    assert(elements.length === 1, 'Transfer activity log not found');

    const element = await extension.driver.findElement(
        Locators.byDataTestId('activityLabel'),
    );
    const txLabel = await element.getText();
    return txLabel === (isSent ? 'Sent 1 VET' : 'Received 1 VET');
};

const goToActivityDetail = async () => {
    await extension.driver.waitAndClick(Locators.byId('extension-activity-0'));
};

const getGasPayer = async () => {
    const element = await extension.driver.waitUntilElement(
        Locators.byId('activity-gas-payer'),
    );
    return await element.getText();
};

const assertTokenTransferDetailLogged = async () => {
    const tokenElement = await extension.driver.findElement(
        Locators.byDataTestId('transferDetailToken'),
    );
    const tokenValue = await tokenElement.getText();
    assert(tokenValue === 'VET', 'Incorrect token symbol in activity detail');

    const amountElement = await extension.driver.findElement(
        Locators.byDataTestId('transferDetailAmount'),
    );
    const amountValue = await amountElement.getText();
    assert(amountValue === '1', 'Incorrect transfer amount in activity detail');
};

const assertConnectedAppActivityLogged = async () => {
    await extension.driver.wait(
        async () => {
            const elements = await extension.driver.findElements(
                Locators.byDataTestId('cert-activity'),
            );
            return elements.length > 0;
        },
        500,
        'Connected App activity log not found',
    );
};

export default {
    isActive,
    isTokenTransferLogged,
    goToActivities,
    goToActivityDetail,
    assertTokenTransferDetailLogged,
    assertConnectedAppActivityLogged,
    getGasPayer,
};
