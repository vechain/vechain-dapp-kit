/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { resolve } from 'path'; // eslint-disable-next-line import/no-default-export

// eslint-disable-next-line import/no-default-export
export default defineConfig({
    test: {
        include: ['test/**/*.test.ts'],
        environment: 'happy-dom',
        reporters: 'dot',
        setupFiles: [resolve(__dirname, 'test/setup/setup.ts')],
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
            lines: 80,
            statements: 80,
            functions: 60,
            branches: 75,
        },
        globals: true,
    },
});
