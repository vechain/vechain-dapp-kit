const Config = require('@vechain/repo-config');

module.exports = {
    ...Config.EslintReact,
    rules: {
        '@typescript-eslint/unbound-method': 'off',
    },
};
