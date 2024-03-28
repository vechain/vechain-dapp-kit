import { By } from 'selenium-webdriver';
import { extension } from 'extension/selenium/WebDriver';

export const findConnectButton = async () => {
    const vdkButtonShadowRoot = await extension.driver
        .findElement(By.css('vdk-button'))
        .getShadowRoot();
    const connectButton = await vdkButtonShadowRoot.findElement(
        By.css('vdk-connect-button'),
    );
    const connectButtonShadowRoot = await connectButton.getShadowRoot();
    return connectButtonShadowRoot.findElement(By.css('button'));
};

export const findAddressButton = async () => {
    const vdkButtonShadowRoot = await extension.driver
        .findElement(By.css('vdk-button'))
        .getShadowRoot();
    const addressButton = await vdkButtonShadowRoot.findElement(
        By.css('vdk-address-button'),
    );
    const connectButtonShadowRoot = await addressButton.getShadowRoot();
    return connectButtonShadowRoot.findElement(By.css('button'));
};

export const findModalVeWorldCardOption = async () => {
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
    return vdkSourceCardShadowRoot.findElement(By.css('button'));
};

export const findModalDisconnectButton = async () => {
    const vdkModalShadowRoot = await extension.driver
        .findElement(By.css('vdk-modal'))
        .getShadowRoot();
    const vdkAddressModal = await vdkModalShadowRoot.findElement(
        By.css('vdk-address-modal'),
    );
    const vdkBaseModalShadowRoot = await vdkAddressModal.getShadowRoot();
    const vdkBaseModal = await vdkBaseModalShadowRoot.findElement(
        By.css('vdk-base-modal'),
    );
    return vdkBaseModal.findElement(By.css('button'));
};
