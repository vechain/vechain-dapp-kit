import { AfterAll, Before } from '@cucumber/cucumber';
import {
    quitWebDriver,
    resetWebDriver,
} from '../../extension/selenium/WebDriver';

/**
 *
 * Runs before EACH scenario
 *
 * Place `@service-worker` above your scenario/feature if you need the service worker for your tests to pass. It takes
 * ~2 seconds to ensure the service worker has started, so it will slow tests down a lot if we require it for every test.
 */
Before(async function (feature) {
    let timeout;

    if (feature.pickle.tags.some((tag) => tag.name === '@service-worker')) {
        timeout = 3000;
        console.log(
            'Using a timeout of 3000ms to ensure service worker is ready',
        );
    }

    console.log('Resetting web driver...');
    await resetWebDriver(timeout);
    console.log('Web driver reset');
});

AfterAll(async function () {
    console.log('Stopping web driver');
    await quitWebDriver();
    console.log('Web driver stopped');
});
