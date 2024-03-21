import { defineStep } from '@cucumber/cucumber';
import assert from 'assert';
import AccessFlows from 'extension/flows/AccessFlows';
import OnboardingFlows from 'extension/flows/OnboardingFlows';
import TokenManagementFlows from 'extension/flows/TokenManagementFlows';
import DashboardScreen from 'extension/screens/DashboardScreen';

defineStep('The user has previously onboarded', async function () {
    await OnboardingFlows.completeOnboarding();
});

defineStep('The user has unlocked VeWorld', async function () {
    await AccessFlows.unlock();
});

defineStep('The user should be on the dashboard', async function () {
    const isActive = await DashboardScreen.isActive();
    assert(isActive, 'The user is not on the dashboard');
});

defineStep('The user connect to VeWorld wallet', async function () {
    await TokenManagementFlows.connectAndInteract(
        () => Promise.resolve(),
        async () => {
            console.log('connected');
        },
    );
});
