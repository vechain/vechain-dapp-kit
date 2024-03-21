import TestDefaults from '../TestDefaults';
import DashboardScreen from '../screens/DashboardScreen';
import UnlockScreen from '../screens/access/UnlockScreen';
import FirstAccessScreen from '../screens/onboarding/FirstAccessScreen';
import NavigationUtils from '../utils/NavigationUtils';

/**
 * Navigate to extension => Then we should be on one of the following screens:
 * - DashboardScreen => Immediately returns as we are already unlocked
 * - FirstAccessScreen => Immediately throws an error as we are not onboarded
 * - UnlockScreen => Enters the password and submits
 * @param password
 */
export const unlock = async (password?: string) => {
    const pw = password || TestDefaults.PASSWORD;

    await NavigationUtils.goToExtension();

    const isDashboardScreenActive = await DashboardScreen.isActive();
    if (isDashboardScreenActive) return;

    const isUnlockScreenActive = await UnlockScreen.isActive();
    if (isUnlockScreenActive) return await UnlockScreen.submitPassword(pw);

    const isFirstAccessScreenActive = await FirstAccessScreen.isActive();
    if (isFirstAccessScreenActive) throw new Error('The user is not onboarded');

    throw new Error('The application is in an unknown state');
};

/**
 * Navigate to extension => Then we should be on one of the following screens:
 * - DashboardScreen => Locks the app
 * - UnlockScreen => Immediately returns as we are already locked
 * - FirstAccessScreen => Immediately throws an error as we are not onboarded
 */
export const lock = async () => {
    await NavigationUtils.goToExtension();

    const isDashboardScreenActive = await DashboardScreen.isActive();
    if (isDashboardScreenActive) return await DashboardScreen.lockApp();

    const isUnlockScreenActive = await UnlockScreen.isActive();
    if (isUnlockScreenActive) return;

    const isFirstAccessScreenActive = await FirstAccessScreen.isActive();
    if (isFirstAccessScreenActive) throw new Error('The user is not onboarded');

    throw new Error('The application is in an unknown state');
};

export default {
    unlock,
    lock,
};
