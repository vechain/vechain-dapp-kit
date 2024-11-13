/// <reference types="vitest" />
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config'; // eslint-disable-next-line import/no-default-export

// eslint-disable-next-line import/no-default-export
export default defineConfig({
    test: {
        include: ['test/**/*.test.ts'],
        environment: 'happy-dom',
        setupFiles: [resolve(__dirname, 'test/setup/setup.ts')],
        reporters: 'dot',
        coverage: {
            reporter: [
                'text',
                'json',
                'html',
                'lcov',
                'json-summary',
                'text-summary',
                'text',
            ],
            lines: 75,
            statements: 60,
            functions: 75,
            branches: 65,
        },
        globals: true,
    },
});
