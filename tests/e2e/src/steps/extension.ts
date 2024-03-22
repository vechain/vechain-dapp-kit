import { defineStep } from '@cucumber/cucumber';
import assert from 'assert';
import { DappUrl } from 'constants/dapp';
import AccessFlows from 'extension/flows/AccessFlows';
import OnboardingFlows from 'extension/flows/OnboardingFlows';
import DashboardScreen from 'extension/screens/DashboardScreen';
import { connectDapp } from 'flows/ConnectFlows';

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

defineStep(
    'The user connect to VeWorld wallet in dapp {string}',
    async function (dapp: string) {
        const dappUrl: string = DappUrl[dapp];
        await connectDapp(dappUrl);
    },
);
