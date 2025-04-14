/* eslint-disable */
import assert from 'assert';
import { defineStep } from '@cucumber/cucumber';
import {
    disconnectDapp,
    disconnectWithCustomButton,
} from 'flows/DisconnectFlows';
import AccessFlows from '../extension/flows/AccessFlows';
import OnboardingFlows from '../extension/flows/OnboardingFlows';
import DashboardFlows from '../extension/flows/DashboardFlows';
import {
    connectDapp,
    connectWithCustomButton,
    sendTransaction,
    signTypedData,
} from '../flows/ConnectFlows';
import { DappUrl } from '../constants/dapp';

defineStep('The user has previously onboarded', async function () {
    console.log('ENTERING STEP: The user has previously onboarded');
    await OnboardingFlows.completeOnboarding();
});

defineStep('The user has unlocked VeWorld', async function () {
    console.log('ENTERING STEP: The user has unlocked VeWorld');
    await AccessFlows.unlock();
});

defineStep('The user should be on the dashboard', async function () {
    console.log('ENTERING STEP: The user should be on the dashboard');
    const isActive = await DashboardFlows.isActive();
    assert(isActive, 'The user is not on the dashboard');
});

defineStep(
    'The user connect to VeWorld wallet in dapp {string}',
    async function (dapp: string) {
        console.log(
            `ENTERING STEP: The user connect to VeWorld wallet in dapp ${dapp}`,
        );
        const dappUrl: string = DappUrl[dapp];
        await connectDapp(dappUrl);
    },
);

defineStep('The user disconnect from the wallet', async function () {
    console.log('ENTERING STEP: The user disconnect from the wallet');
    await disconnectDapp();
});

defineStep(
    'The user connect to VeWorld wallet with custom button in dapp {string}',
    async function (dapp: string) {
        console.log(
            `ENTERING STEP: The user connect to VeWorld wallet with custom button in dapp ${dapp}`,
        );
        const dappUrl: string = DappUrl[dapp];
        await connectWithCustomButton(dappUrl);
    },
);

defineStep(
    'The user disconnect from the wallet with custom button',
    async function () {
        console.log(
            'ENTERING STEP: The user disconnect from the wallet with custom button',
        );
        await disconnectWithCustomButton();
    },
);

defineStep(
    'The user sends a transaction in dapp {string}',
    async function (dapp: string) {
        console.log(
            `ENTERING STEP: The user sends a transaction in dapp ${dapp}`,
        );
        const dappUrl: string = DappUrl[dapp];
        return await sendTransaction(dappUrl);
    },
);

defineStep(
    'The user signs typed data in dapp {string}',
    async function (dapp: string) {
        console.log(`ENTERING STEP: The user signs typed data in dapp ${dapp}`);
        const dappUrl: string = DappUrl[dapp];
        return await signTypedData(dappUrl);
    },
);
