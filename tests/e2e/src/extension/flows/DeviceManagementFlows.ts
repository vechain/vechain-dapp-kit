import assert from 'assert';
import ImportLocalMnemonicScreen from '../screens/onboarding/ImportLocalMnemonicScreen';
import CreateNewWalletScreen from '../screens/onboarding/GenerateNewWallet';
import NavigationUtils from '../utils/NavigationUtils';
import { ROUTES } from '../enums';
import VerifyNewWallet from '../screens/onboarding/VerifyNewWallet';
import Locators from '../selenium/Locators';
import { extension } from '../selenium/WebDriver';

const setupMnemonic = async (mnemonic: string) => {
    await NavigationUtils.goToExtension(ROUTES.IMPORT_LOCAL_WALLET);
    await NavigationUtils.goToExtension(ROUTES.IMPORT_LOCAL_WALLET_MNEMONIC);

    await ImportLocalMnemonicScreen.isActive();
    assert(
        ImportLocalMnemonicScreen,
        'The user is not on the import local wallet screen',
    );

    await ImportLocalMnemonicScreen.enterMnemonic(mnemonic);

    await extension.driver.waitAndClick(
        Locators.byDataTestId('importLocalWalletMnemonicButton'),
    );
};

const generateNewWallet = async () => {
    await NavigationUtils.goToExtension(ROUTES.NEW_LOCAL_WALLET);
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

    await extension.driver.waitAndClick(
        Locators.byId('confirmInsertMnemonicForm'),
    );
};

export default {
    setupMnemonic,
    generateNewWallet,
    verifyMnemonic,
};
