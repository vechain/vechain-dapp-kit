import FirstAccessScreen from '../screens/onboarding/FirstAccessScreen';
import assert from 'assert';
import SetupPasswordScreen from '../screens/onboarding/SetupPasswordScreen';
import ImportLocalMnemonicScreen from '../screens/onboarding/ImportLocalMnemonicScreen';
import ImportLocalKeystoreScreen from '../screens/onboarding/ImportLocalKeystoreScreen';
import CreateNewWalletScreen from '../screens/onboarding/GenerateNewWallet';
import VerifyNewWallet from '../screens/onboarding/VerifyNewWallet';
import TestDefaults from '../TestDefaults';
import NavigationUtils from '../utils/NavigationUtils';
import CompletedWalletScreen from '../screens/onboarding/CompletedWalletScreen';
import { HDNode } from 'thor-devkit';
import ImportLocalPrivateKeyScreen from '../screens/onboarding/ImportLocalPrivateKeyScreen';

const setupPassword = async (password: string, confirmPassword: string) => {
    //Navigate from first access
    const isFirstAccess = await FirstAccessScreen.isActive();
    assert(isFirstAccess, 'The user is not on the first access screen');
    await FirstAccessScreen.navigateToPasswordSetup();

    //Enter the passwords and submit
    await SetupPasswordScreen.enterPassword(password);
    await SetupPasswordScreen.enterConfirmPassword(confirmPassword);
    await SetupPasswordScreen.submit();
};

const setupMnemonic = async (mnemonic: string) => {
    //Navigate from password setup
    const isPasswordSubmitted = await SetupPasswordScreen.isPasswordSubmitted();
    assert(isPasswordSubmitted, 'Not on screen after password submission');
    await SetupPasswordScreen.navigateToImportWalletMnemonic();

    //Enter the mnemonic and submit
    await ImportLocalMnemonicScreen.enterMnemonic(mnemonic);
    await ImportLocalMnemonicScreen.submit();

    try {
        HDNode.fromMnemonic(mnemonic.split(' '));
    } catch (e) {
        console.log('Mnemonic is invalid, not proceeding to dashboard');
        return;
    }

    await CompletedWalletScreen.isActive();
    await CompletedWalletScreen.navigateToDashboard();
};

const setupPrivateKey = async (privateKey: string) => {
    //Navigate from password setup
    const isPasswordSubmitted = await SetupPasswordScreen.isPasswordSubmitted();
    assert(isPasswordSubmitted, 'Not on screen after password submission');
    await SetupPasswordScreen.navigateToImportWalletPrivateKey();

    //Enter the private key and submit
    await ImportLocalPrivateKeyScreen.enterPrivateKey(privateKey);
    await ImportLocalPrivateKeyScreen.submit();

    await CompletedWalletScreen.isActive();
    await CompletedWalletScreen.navigateToDashboard();
};

const setupKeystore = async (
    keystorePath: string,
    keystorePassword: string,
) => {
    //Navigate from password setup
    const isPasswordSubmitted = await SetupPasswordScreen.isPasswordSubmitted();
    assert(isPasswordSubmitted, 'Not on screen after password submission');
    await SetupPasswordScreen.navigateToImportKeystore();

    //Enter the upload keystore and submit
    await ImportLocalKeystoreScreen.uploadKeystore(
        keystorePath,
        keystorePassword,
    );
    await ImportLocalKeystoreScreen.submit();

    await CompletedWalletScreen.isActive();
    await CompletedWalletScreen.navigateToDashboard();
};

const generateNewWallet = async () => {
    //Navigate from password setup
    const isPasswordSubmitted = await SetupPasswordScreen.isPasswordSubmitted();
    assert(isPasswordSubmitted, 'Not on screen after password submission');
    await SetupPasswordScreen.navigateToSetupNewWallet();

    //Check we are on the create new wallet screen
    const isNewWalletScreenActive = await CreateNewWalletScreen.isActive();
    assert(isNewWalletScreenActive, 'New wallet screen is not active');

    //Store the wallet for later
    const mnemonic = await CreateNewWalletScreen.copyMnemonic();
    await CreateNewWalletScreen.proceedAfterCopy();
    return mnemonic;
};

const verifyMnemonic = async (mnemonic: string[], isValid: boolean) => {
    //Check we are on verify mnemonic screen
    const isVerifyActive = await VerifyNewWallet.isActive();
    assert(isVerifyActive, 'Not on verify mnemonic screen');

    assert(
        Array.isArray(mnemonic),
        "Can't find the previously generated mnemonic",
    );

    await VerifyNewWallet.fillConfirmation(mnemonic, isValid);
    await VerifyNewWallet.verifyMnemonic(isValid);
};

const completeOnboarding = async (mnemonic?: string, password?: string) => {
    mnemonic = mnemonic || TestDefaults.MNEMONIC;
    password = password || TestDefaults.PASSWORD;

    await NavigationUtils.goToExtension();

    await setupPassword(password, password);
    await setupMnemonic(mnemonic);
};

export default {
    setupPassword,
    setupMnemonic,
    setupPrivateKey,
    setupKeystore,
    generateNewWallet,
    verifyMnemonic,
    completeOnboarding,
};
