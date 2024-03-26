/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-param-reassign */
import assert from 'assert';
import TestDefaults from '../TestDefaults';
import NavigationUtils from '../utils/NavigationUtils';
import FirstAccessFlows from './FirstAccessFlows';
import SetupPasswordFlows from './SetupPasswordFlows';
import ImportLocalMnemonicFlows from './ImportLocalMnemonicFlows';
import CompletedWalletFlows from './CompletedWalletFlows';

const setupPassword = async (password: string, confirmPassword: string) => {
    //Navigate from first access
    const isFirstAccess = await FirstAccessFlows.isActive();
    assert(isFirstAccess, 'The user is not on the first access screen');
    await FirstAccessFlows.navigateToPasswordSetup();

    //Enter the passwords and submit
    await SetupPasswordFlows.enterPassword(password);
    await SetupPasswordFlows.enterConfirmPassword(confirmPassword);
    await SetupPasswordFlows.submit();
};

const setupMnemonic = async (mnemonic: string) => {
    //Navigate from password setup
    const isPasswordSubmitted = await SetupPasswordFlows.isPasswordSubmitted();
    assert(isPasswordSubmitted, 'Not on screen after password submission');
    await SetupPasswordFlows.navigateToImportWalletMnemonic();

    //Enter the mnemonic and submit
    await ImportLocalMnemonicFlows.enterMnemonic(mnemonic);
    await ImportLocalMnemonicFlows.submit();

    await CompletedWalletFlows.isActive();
    await CompletedWalletFlows.navigateToDashboard();
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
    completeOnboarding,
};
