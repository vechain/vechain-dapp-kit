import { resolve } from 'node:path';

const project = resolve(process.cwd(), 'tsconfig.json');

export default {
    extends: [
        '@vercel/style-guide/eslint/node',
        '@vercel/style-guide/eslint/typescript',
    ],
    parserOptions: {
        project,
    },
    globals: {
        React: true,
        JSX: true,
    },
    settings: {
        'import/resolver': {
            typescript: {
                project,
            },
        },
    },
    ignorePatterns: ['node_modules/', 'dist/'],
    rules: {
        'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
        'func-style': ['error', 'expression', { allowArrowFunctions: true }],
    },
};
