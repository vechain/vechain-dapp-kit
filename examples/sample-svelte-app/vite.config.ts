import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(({ mode }) => ({
    plugins: [nodePolyfills(), sveltekit()],
    preview: {
        port: 5005,
        strictPort: true,
    },
    server: {
        port: 5005,
        strictPort: true,
        host: true,
        origin: 'http://0.0.0.0:5005',
    },
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
    base: mode === 'production' ? '/vechain-dapp-kit/svelte/' : '/',
}));
