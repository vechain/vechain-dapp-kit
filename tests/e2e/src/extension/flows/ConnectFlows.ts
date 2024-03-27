import { By } from 'selenium-webdriver';
import { extension } from '../selenium/WebDriver';

const connectWallet = async () => {
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

export default {
    connectWallet,
};
