/// <reference types="vitest" />
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
    test: {
        include: ['test/**/*.test.ts'],
        environment: 'jsdom',
        setupFiles: [resolve(__dirname, 'test/setup/setup.ts')],
        reporters: 'dot',
        coverage: {
            reporter: ['text', 'json', 'html'],
        },
        globals: true,
    },
});
