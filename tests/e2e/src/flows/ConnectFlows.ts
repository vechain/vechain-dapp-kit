import Locators from 'extension/selenium/Locators';
import {
    findConnectButton,
    findModalVeWorldCardOption,
} from 'utils/VdkElementsUtils';
import ApproveFlows from '../extension/flows/ApproveFlows';
import NavigationUtils from '../extension/utils/NavigationUtils';
import { extension } from '../extension/selenium/WebDriver';

export const connectDapp = async function (dappUrl: string) {
    const windowHandle = await NavigationUtils.goToUrl(dappUrl);

    const connectButton = await findConnectButton();
    await connectButton.click();

    const veWorldCardOption = await findModalVeWorldCardOption();
    await veWorldCardOption.click();

    await ApproveFlows.approveAndSign();

    await NavigationUtils.switchToWindow(windowHandle);
};

export const connectWithCustomButton = async function (dappUrl: string) {
    const windowHandle = await NavigationUtils.goToUrl(dappUrl);

    await extension.driver
        .findElement(Locators.buttonByText('Connect Custom Button'))
        .click();

    const veWorldCardOption = await findModalVeWorldCardOption();
    await veWorldCardOption.click();
    await NavigationUtils.switchToExtensionIframe();
    await ApproveFlows.sign();
    await NavigationUtils.switchToWindow(windowHandle);
};

export const sendTransaction = async function (dappUrl: string) {
    await NavigationUtils.goToUrl(dappUrl);

    await extension.driver
        .findElement(Locators.buttonByText('Send'))
        .click();

    await NavigationUtils.switchToExtensionIframe();
    await ApproveFlows.signTransaction();
}

export  const signTypedData = async function (dappUrl: string) {
    await NavigationUtils.goToUrl(dappUrl);

    await extension.driver
        .findElement(Locators.buttonByText('Sign Typed Data'))
        .click();

    await NavigationUtils.switchToExtensionIframe();
    await ApproveFlows.sign();
}
