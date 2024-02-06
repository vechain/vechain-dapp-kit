/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { resolve } from 'path';

export default defineConfig({
    plugins: [nodePolyfills(), react()],
    //vitest
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: [
            resolve(__dirname, 'test/setup/setup.ts'),
            resolve(__dirname, 'test/setup/resizeObserverMock.ts'),
        ],
    },
    base:
        process.env.NODE_ENV === 'production'
            ? '/vechain-dapp-kit/react/'
            : '/',
});
