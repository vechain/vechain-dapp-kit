const Config = require('@vechain/repo-config');

module.exports = {
    ...Config.EslintReact,
    ignorePatterns: [
        ...Config.EslintReact.ignorePatterns,
        '*.test.ts',
        'test/**',
    ],
    rules: {
        ...Config.EslintReact.rules,
        'import/no-extraneous-dependencies': 'error',
    },
};
