const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

module.exports = {
    extends: [
        '@vercel/style-guide/eslint/node',
        '@vercel/style-guide/eslint/typescript',
    ].map(require.resolve),
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
