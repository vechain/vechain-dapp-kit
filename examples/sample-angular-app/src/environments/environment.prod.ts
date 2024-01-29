// eslint-disable @typescript-eslint/no-unsafe-assignment
// eslint-disable @typescript-eslint/no-unsafe-member-access
// Packages
import packageInfo from '../../package.json';

const scheme = 'http://';
const host = 'localhost';
const port = ':5000';
const path = '/api/';

const baseUrl = scheme + host + port + path;

export const environment = {
    production: true,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    version: packageInfo.version,
    appName: 'EasyAngular',
    envName: 'prod',
    defaultLanguage: 'en',
    apiBaseUrl: baseUrl,
};
