/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
    test: {
        include: [
            'src/**/*.test.ts',
            'src/**/*.test.tsx',
            'test/**/*.test.ts',
            'test/**/*.test.tsx',
        ],
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
            statements: 80,
            functions: 60,
            branches: 75,
        },
        globals: true,
    },
});
