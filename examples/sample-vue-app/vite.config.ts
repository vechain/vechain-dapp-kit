import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [vue(), nodePolyfills()],
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
    base: mode === 'production' ? '/vechain-dapp-kit/vue/' : '/',
    preview: {
        port: 5006,
        strictPort: true,
    },
    server: {
        port: 5006,
        strictPort: true,
        host: true,
        origin: 'http://0.0.0.0:5006',
    },
}));
