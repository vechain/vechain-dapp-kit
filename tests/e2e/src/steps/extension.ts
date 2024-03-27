import assert from 'assert';
import { defineStep } from '@cucumber/cucumber';
import AccessFlows from '../extension/flows/AccessFlows';
import OnboardingFlows from '../extension/flows/OnboardingFlows';
import DashboardFlows from '../extension/flows/DashboardFlows';
import { connectDapp } from '../flows/ConnectFlows';
import { DappUrl } from '../constants/dapp';

defineStep('The user has previously onboarded', async function () {
    await OnboardingFlows.completeOnboarding();
});

defineStep('The user has unlocked VeWorld', async function () {
    await AccessFlows.unlock();
});

defineStep('The user should be on the dashboard', async function () {
    const isActive = await DashboardFlows.isActive();
    assert(isActive, 'The user is not on the dashboard');
});

defineStep(
    'The user connect to VeWorld wallet in dapp {string}',
    async function (dapp: string) {
        const dappUrl: string = DappUrl[dapp];
        await connectDapp(dappUrl);
    },
);
