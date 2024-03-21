import NavigationUtils from '../../utils/NavigationUtils';
import TestDefaults from '../../TestDefaults';
import Locators from '../../selenium/Locators';
import { extension } from '../../selenium/WebDriver';
import AddressUtils from 'extension/utils/AddressUtils';
import { By } from 'selenium-webdriver/lib/by';

const isActive = async () => {
    throw Error('Not implemented');
};

//Clicks on x-1, y-1 of the page to exit the modals
const removeModals = async () => {
    await extension.driver.actions().move({ x: 1, y: 1 }).click().perform();
};

const isAccountVisible = async (windowHandle: string) => {
    await extension.driver.switchTo().window(windowHandle);
    await removeModals();

    const accountElement = await extension.driver.findElement(
        Locators.byId('connect-wallet-address-button'),
    );
    const addr = await accountElement.getText();
    return AddressUtils.isValid(addr);
};

const connectWallet = async (windowHandle: string) => {
    await NavigationUtils.goToUrl(TestDefaults.DAPP_URL);

    // Click connect button
    const vdkButtonShadowRoot = await extension.driver
        .findElement(By.css('vdk-button'))
        .getShadowRoot();
    const connectButton = await vdkButtonShadowRoot.findElement(
        By.css('vdk-connect-button'),
    );
    const connectButtonShadowRoot = await connectButton.getShadowRoot();
    const button = await connectButtonShadowRoot.findElement(By.css('button'));
    await button.click();

    // // Click veworld source
    const vdkModalShadowRoot = await extension.driver
        .findElement(By.css('vdk-modal'))
        .getShadowRoot();
    const vdkConnectModal = await vdkModalShadowRoot.findElement(
        By.css('vdk-connect-modal'),
    );
    const vdkBaseModalShadowRoot = await vdkConnectModal.getShadowRoot();
    const vdkSourceCard = await vdkBaseModalShadowRoot.findElements(
        By.css('vdk-source-card'),
    );
    const vdkSourceCardShadowRoot = await vdkSourceCard[0].getShadowRoot();
    const cardButton = await vdkSourceCardShadowRoot.findElement(
        By.css('button'),
    );
    await cardButton.click();
};

const isConnected = async (windowHandle: string) => {
    await NavigationUtils.switchToWindow(windowHandle);
    await removeModals();

    try {
        await extension.driver.waitUntilElement(
            Locators.bySelector('Connect Wallet'),
        );
        return false;
    } catch (e) {
        return true;
    }
};

const triggerTokenDeploy = async (windowHandle: string) => {
    await NavigationUtils.switchToWindow(windowHandle);

    await extension.driver.waitAndClick(
        Locators.byId('get-started-button-fungible'),
    );
    await extension.driver.waitAndClick(
        Locators.byId('deploy-new-token-button'),
    );

    //VIP 180: Name
    await extension.driver.waitAndType(
        Locators.byId('token-name'),
        'TestToken',
    );
    //VIP 180: Symbol
    await extension.driver.waitAndType(Locators.byId('token-symbol'), 'TKN');
    //VIP 180: Decimals
    await extension.driver.waitAndType(Locators.byId('token-decimals'), '2');

    //Submit
    await extension.driver.waitAndClick(Locators.byId('submit-deploy-token'));
};

const getTokenAddress = async (windowHandle: string): Promise<string> => {
    await NavigationUtils.switchToWindow(windowHandle);

    await extension.driver.waitUntilElement(
        Locators.byId('transaction-successful-id'),
    );

    await extension.driver.waitAndClick(Locators.byId('back-deploy-token'));

    const addressElement = await extension.driver.waitUntilElement(
        Locators.byId('fungible-token-address'),
        TestDefaults.TRANSACTION_TIMEOUT,
    );

    return await addressElement.getText();
};

const checkRequestCancellation = async (windowHandle: string) => {
    await NavigationUtils.switchToWindow(windowHandle);

    const feedback = await extension.driver.findElement(
        Locators.byId('transaction-failed-description'),
    );
    const feedbackMessage = await feedback.getText();
    return feedbackMessage === 'User cancelled request';
};

const getConnectedAccount = async (windowHandle: string) => {
    await NavigationUtils.switchToWindow(windowHandle);
    await removeModals();

    const accountElement = await extension.driver.findElement(
        Locators.byId('connect-wallet-address-button'),
    );
    return await accountElement.getText();
};

const mintNFTs = async (windowHandle: string) => {
    await NavigationUtils.switchToWindow(windowHandle);
    await removeModals();

    await extension.driver.waitAndClick(
        Locators.byId('get-started-button-nfts'),
    );

    await extension.driver.waitAndClick(Locators.byText('Mint', 'button'));

    await extension.driver.waitAndType(
        Locators.inputByName('address'),
        '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
    );

    await extension.driver.waitAndType(
        Locators.inputByName('clausesNumber'),
        '100',
    );

    await extension.driver.waitAndClick(Locators.buttonByType('submit'));
};

const triggerNFTDeploy = async (windowHandle: string) => {
    await NavigationUtils.switchToWindow(windowHandle);
    await removeModals();

    await extension.driver.waitAndClick(
        Locators.byId('get-started-button-nfts'),
    );
    await extension.driver.waitAndClick(
        Locators.byText('Deploy new NFT', 'button'),
    );

    await extension.driver.waitAndType(Locators.inputByName('name'), 'TestNFT');
    await extension.driver.waitAndType(Locators.inputByName('symbol'), 'NFT');
    await extension.driver.waitAndType(
        Locators.inputByName('baseTokenURI'),
        'https://myuri.com',
    );

    await extension.driver.waitAndClick(Locators.buttonByType('submit'));
};

const getNFTAddress = async (windowHandle: string): Promise<string> => {
    await NavigationUtils.switchToWindow(windowHandle);

    await extension.driver.waitUntilElement(
        Locators.byId('transaction-successful-id'),
    );

    await extension.driver.waitAndClick(Locators.byTextPart('Back', 'button'));

    const addressElement = await extension.driver.waitUntilElement(
        Locators.byId('nft-contract-address'),
        TestDefaults.TRANSACTION_TIMEOUT,
    );

    return await addressElement.getText();
};

export default {
    isActive,
    isAccountVisible,
    connectWallet,
    triggerTokenDeploy,
    getTokenAddress,
    checkRequestCancellation,
    getConnectedAccount,
    triggerNFTDeploy,
    getNFTAddress,
    mintNFTs,
    isConnected,
};
