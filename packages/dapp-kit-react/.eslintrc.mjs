import { resolve } from 'node:path';

const project = resolve(process.cwd(), 'tsconfig.json');

// eslint-disable-next-line import/no-default-export
export default {
    extends: [
        '@vercel/style-guide/eslint/browser',
        '@vercel/style-guide/eslint/typescript',
        '@vercel/style-guide/eslint/react',
    ].map(resolve),
    parserOptions: {
        project,
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    parser: '@typescript-eslint/parser',
    globals: {
        JSX: true,
    },
    settings: {
        'import/resolver': {
            typescript: {
                project,
            },
        },
    },
    ignorePatterns: [
        'node_modules/',
        'dist/',
        '.eslintrc.js',
        '**/*.css',
        '*.test.ts',
        'test/**',
    ],
    // add rules configurations here
    rules: {
        'import/no-default-export': 'off',
        'unicorn/filename-case': 'off',
        'react-hooks/exhaustive-deps': 'error',
        'react/function-component-definition': [
            'error',
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function',
            },
        ],
        'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
        'func-style': ['error', 'expression', { allowArrowFunctions: true }],
    },
};
