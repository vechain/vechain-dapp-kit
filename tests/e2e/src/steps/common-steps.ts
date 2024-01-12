import { Given } from '@cucumber/cucumber';
import { ICustomWorld } from 'tests/e2e/src/types';

Given('The user is in the homepage', async function (this: ICustomWorld) {
    await this.openUrl('http://localhost:1234');
});
