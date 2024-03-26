import NavigationUtils from '../utils/NavigationUtils';
import TestDefaults from '../TestDefaults';
import DashboardScreen from './DashboardFlows';
import UnlockFlows from './UnlockFlows';
import FirstAccessFlows from './FirstAccessFlows';

export const unlock = async (password?: string) => {
    const pw = password ?? TestDefaults.PASSWORD;

    await NavigationUtils.goToExtension();

    const isDashboardScreenActive = await DashboardScreen.isActive();
    if (isDashboardScreenActive) return;

    const isUnlockFlowsActive = await UnlockFlows.isActive();
    if (isUnlockFlowsActive) return UnlockFlows.submitPassword(pw);

    const isFirstAccessFlowsActive = await FirstAccessFlows.isActive();
    if (isFirstAccessFlowsActive) throw new Error('The user is not onboarded');

    throw new Error('The application is in an unknown state');
};

export const lock = async () => {
    await NavigationUtils.goToExtension();

    const isDashboardScreenActive = await DashboardScreen.isActive();
    if (isDashboardScreenActive) return DashboardScreen.lockApp();

    const isUnlockFlowsActive = await UnlockFlows.isActive();
    if (isUnlockFlowsActive) return;

    const isFirstAccessFlowsActive = await FirstAccessFlows.isActive();
    if (isFirstAccessFlowsActive) throw new Error('The user is not onboarded');

    throw new Error('The application is in an unknown state');
};

export default {
    unlock,
    lock,
};
