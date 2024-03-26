import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [nodePolyfills()],
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
    base:
        process.env.NODE_ENV === 'production'
            ? '/vechain-dapp-kit/vanilla/'
            : '/',
    preview: {
        port: 5003,
        strictPort: true,
    },
    server: {
        port: 5003,
        strictPort: true,
        host: true,
        origin: 'http://0.0.0.0:5003',
    },
});
