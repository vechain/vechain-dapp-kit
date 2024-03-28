import { AfterAll, BeforeAll, setDefaultTimeout } from '@cucumber/cucumber';
import {
    DockerComposeEnvironment,
    StartedDockerComposeEnvironment,
    Wait,
} from 'testcontainers';
import path from 'path';
import { DappUrl } from '../../constants/dapp';
import axios from 'axios';

setDefaultTimeout(180_000);

let dockerEnvironment: StartedDockerComposeEnvironment;

const appHealthCheck = async () => {
    // remix app is excluded from health check because it returns 500 but the app loads fine
    const excludedApps = ['remix'];
    const dapps = Object.entries(DappUrl).filter(
        ([app]) => !excludedApps.includes(app),
    );

    for (const [app, url] of dapps) {
        console.log(`Performing health check for ${app} at ${url}...`);

        for (let j = 0; j < 120; j++) {
            try {
                await axios.get(url, { proxy: undefined });
                break;
            } catch (e) {
                if (e instanceof axios.AxiosError) {
                    console.log(app, e.message, e.code);
                } else {
                    console.log(`Waiting for ${app} to be ready...`);
                }
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
    }
};

BeforeAll(async function () {
    console.log('Starting docker compose environment...');

    if (process.env.DOCKER_RUNNING) {
        console.log('Docker environment already running');
        return;
    }

    const composePath = path.join(__dirname, '..', '..', '..');
    const composeFile = 'docker-compose.yaml';

    try {
        dockerEnvironment = await new DockerComposeEnvironment(
            composePath,
            composeFile,
        )
            .withStartupTimeout(60_000)
            .withWaitStrategy('thor-solo', Wait.forHealthCheck())
            .withWaitStrategy('mockserver', Wait.forLogMessage('INFO'))
            .up();
    } catch (e) {
        console.error(e);
        throw e;
    }

    await appHealthCheck();

    console.log('Docker compose environment started');
});

AfterAll(async function () {
    try {
        if (dockerEnvironment && !process.env.DOCKER_RUNNING) {
            console.log('\nStopping docker compose environment');
            await dockerEnvironment.down();
            console.log('Docker compose environment stopped');
        } else {
            console.log('Not stopping docker compose environment');
        }
    } catch (e) {
        console.error(e);
    }
});
