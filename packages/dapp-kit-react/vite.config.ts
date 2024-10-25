/// <reference types="vitest" />
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

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
            statements: 99,
            branches: 100,
            functions: 100,
            lines: 99,
        },
        globals: true,
    },
});
