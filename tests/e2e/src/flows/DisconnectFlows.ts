import Locators from 'extension/selenium/Locators';
import {
    findAddressButton,
    findModalDisconnectButton,
} from 'utils/VdkElementsUtils';
import { extension } from '../extension/selenium/WebDriver';

export const disconnectDapp = async function () {
    const addressButton = await findAddressButton();
    await addressButton.click();

    const disconnectButton = await findModalDisconnectButton();
    await disconnectButton.click();
};

export const disconnectWithCustomButton = async () => {
    await extension.driver
        .findElement(Locators.buttonByTextPart('Disconnect'))
        .click();

    const disconnectButton = await findModalDisconnectButton();
    await disconnectButton.click();
};
