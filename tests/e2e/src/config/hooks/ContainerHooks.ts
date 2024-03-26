import { AfterAll, BeforeAll, setDefaultTimeout } from '@cucumber/cucumber';
import {
    DockerComposeEnvironment,
    StartedDockerComposeEnvironment,
    Wait,
} from 'testcontainers';
import path from 'path';

setDefaultTimeout(180_000);

let dockerEnvironment: StartedDockerComposeEnvironment;

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
