import { extension } from '../../../selenium/WebDriver';
import Locators from '../../../selenium/Locators';
import ScreenUtils from '../../../utils/ScreenUtils';
import { ROUTES } from '../../../enums';
import PasswordPrompt from '../../../screens/PasswordPrompt';
import TestDefaults from '../../../TestDefaults';
import NavigationUtils from '../../../utils/NavigationUtils';
import { By, Key, logging, WebElement } from 'selenium-webdriver';

const NEW_PASSWORD = 'myPassword124';
const NON_MATCHING_NEW_PASSWORD = 'myPassword125';
const INCORRECT_PASSWORD = 'myPassword126';

const isActive = async () => {
    const locator = Locators.byDataTestId('appBarTitleId');
    return ScreenUtils.isActive([locator], ROUTES.SETTINGS_SECURITY_PRIVACY);
};

const updatePasswordAuthorization = async (newMode: boolean) => {
    const locator = Locators.byDataTestId('localWalletMode');
    const toggle = await extension.driver.waitUntilElementEnabled(locator);
    const isActive = await extension.driver.isElementChecked(locator);

    if (isActive !== newMode) await toggle.click();
    if (newMode === false) {
        await PasswordPrompt.submitPassword(TestDefaults.PASSWORD);
    }
};

const attemptSignTransaction = async () => {
    await NavigationUtils.goToExtension(ROUTES.SEND);

    const tokenBoxes = await extension.driver.waitUntilElements(
        Locators.byDataTestId('tokenbox'),
    );
    await tokenBoxes[0].click();

    await extension.driver.waitAndClick(
        Locators.byClass('react-select__value-container'),
    );

    await extension.driver.waitAndType(
        Locators.byId('searchInput'),
        '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68',
    );

    const element = await extension.driver.waitUntilElementEnabled(
        Locators.byId('searchInput'),
    );
    await element.sendKeys(Key.ENTER);

    await extension.driver.waitAndType(Locators.byId('amountToTransfer'), '1');

    await extension.driver.waitAndClick(Locators.byDataTestId('sendTokenBtn'));
    //Wait for loader to go away
    await extension.driver.sleep(1500);
    await extension.driver.waitAndClick(Locators.byId('sendTransactionButton'));
};

const isPasswordPrompt = async () => {
    return await extension.driver.isElementPresent(
        Locators.byId('enterPasswordInput'),
    );
};

const attemptPasswordChange = async (
    newPassword = NEW_PASSWORD,
    matchingPassword = true,
) => {
    const resetPassword = await extension.driver.findElement(
        Locators.byId('resetPasswordSettings'),
    );
    await resetPassword.click();

    await extension.driver.waitAndType(
        Locators.byId('passwordInput'),
        newPassword,
    );
    await extension.driver.waitAndType(
        Locators.byId('confirmPasswordInput'),
        matchingPassword ? newPassword : NON_MATCHING_NEW_PASSWORD,
    );
    const resetBtn = await extension.driver.findElement(
        Locators.byDataTestId('confirmPasswordButton'),
    );
    await resetBtn.click();
};

const isPasswordUpdated = async (isPasswordPrompt = true) => {
    if (isPasswordPrompt)
        await PasswordPrompt.submitPassword(TestDefaults.PASSWORD);

    let isUpdated = false;
    try {
        // Attempt to restore default password, using the new password
        await attemptPasswordChange(TestDefaults.PASSWORD);
        await PasswordPrompt.submitPassword(NEW_PASSWORD);
        isUpdated = true;
    } catch (e) {
        // Failure means the password hasn't been updated
        console.log(e);
    }

    return isUpdated;
};

const attemptPasswordChangeWithIncorrectPassword = async () => {
    await attemptPasswordChange();
    await PasswordPrompt.submitPassword(INCORRECT_PASSWORD);
};

const idleForTheAutoLockTimeout = async () => {
    // Wait 60s (minimum idle query state) + 20s inactivity delay
    await extension.driver.sleep(80 * 1000);
};

const isAutoLockWorkerActive = async () => {
    let autoLockWorkerLogs: logging.Entry[] = [];
    await extension.driver
        .manage()
        .logs()
        .get(logging.Type.BROWSER)
        .then((entries) => {
            autoLockWorkerLogs = entries.filter((entry) =>
                entry.message.includes('Current idle state: '),
            );
        });
    console.log(autoLockWorkerLogs);
    return autoLockWorkerLogs.length > 0;
};

const attemptBackupMnemonic = async () => {
    const backupBtn = await extension.driver.findElement(
        Locators.byDataTestId('backupMnemonicButton'),
    );
    await backupBtn.click();
    await extension.driver.waitAndClick(Locators.byDataTestId('continueBtn'));
};

const isMnemonicDisplayed = async () => {
    await PasswordPrompt.submitPassword(TestDefaults.PASSWORD);
    const mnemonicWords = await extension.driver.findElements(
        By.xpath("//span[starts-with(@id, 'mnemonic-word-')]"),
    );
    return checkValidMnemonic(mnemonicWords);
};

const checkValidMnemonic = async (words: WebElement[]) => {
    let backupMnemonics: string = '';
    for (let i = 0; i < 12; i++) {
        let word = await words[i].getText();
        backupMnemonics = backupMnemonics + ' ' + word;
    }
    return backupMnemonics.trim() === TestDefaults.MNEMONIC;
};

const isAnalyticsOptionEnabled = async () => {
    return await extension.driver.isElementChecked(
        Locators.byDataTestId('analyticsTracking'),
    );
};

export default {
    isActive,
    updatePasswordAuthorization,
    attemptSignTransaction,
    isPasswordPrompt,
    attemptPasswordChange,
    isPasswordUpdated,
    attemptPasswordChangeWithIncorrectPassword,
    idleForTheAutoLockTimeout,
    attemptBackupMnemonic,
    isMnemonicDisplayed,
    isAutoLockWorkerActive,
    isAnalyticsOptionEnabled,
};
