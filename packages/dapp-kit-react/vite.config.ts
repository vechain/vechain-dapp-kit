/// <reference types="vitest" />
import { resolve } from 'path';
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
            lines: 90,
            statements: 90,
            functions: 90,
            branches: 75,
        },
        globals: true,
    },
});
