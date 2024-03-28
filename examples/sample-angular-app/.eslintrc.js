const Config = require('@vechain/repo-config');

module.exports = {
    ...Config.EslintLibrary,
    rules: {
        'no-constant-binary-expression': 'off',
        'eslint-comments/disable-enable-pair': 'off',
    },
};
