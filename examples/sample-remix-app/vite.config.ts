import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { installGlobals } from '@remix-run/node';

installGlobals();
export default defineConfig(({ mode }) => ({
    plugins: [remix(), tsconfigPaths()],
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
    define: {
        // By default, Vite doesn't include shims for NodeJS/
        // necessary for segment analytics lib to work
        global: {},
        process: {
            env: { DEBUG: undefined },
            version: '', // to avoid undefined.slice error
        },
    },
    resolve: {
        alias: {
            process: 'process/browser',
            buffer: 'buffer',
            crypto: 'crypto-browserify',
            stream: 'stream-browserify',
            assert: 'assert',
            http: 'stream-http',
            https: 'https-browserify',
            os: 'os-browserify',
            url: 'url',
            util: 'util',
        },
    },
    base: mode === 'production' ? '/vechain-dapp-kit/react/' : '/',
}));
