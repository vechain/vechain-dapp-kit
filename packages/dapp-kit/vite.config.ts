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
            statements: 65,
            functions: 75,
            branches: 60,
        },
        globals: true,
    },
});
