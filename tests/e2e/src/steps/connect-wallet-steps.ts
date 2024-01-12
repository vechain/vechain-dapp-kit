import { Then, When } from '@cucumber/cucumber';
// eslint-disable-next-line import/no-extraneous-dependencies
import expect from 'expect';
import { ICustomWorld } from 'types';

When(
    'The user click the CTA to connect to a wallet',
    async function (this: ICustomWorld) {
        await this.clickByText('Connect Wallet');
    },
);

Then(
    'The user should see every wallet option',
    async function (this: ICustomWorld) {
        expect(await this.isVisibleByText('Wallet Connect')).toBe(true);
        expect(await this.isVisibleByText('VeWorld Extension')).toBe(true);
        expect(await this.isVisibleByText('Sync')).toBe(true);
        expect(await this.isVisibleByText('Sync 2')).toBe(true);
        expect(await this.isVisibleByText('Sync 3')).toBe(false);
    },
);
