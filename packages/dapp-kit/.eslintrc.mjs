const Config = require('@vechain/repo-config');

module.exports = {
    ...Config.EslintLibrary,
    rules: {
        ...Config.EslintLibrary.rules,
        'import/no-extraneous-dependencies': 'error',
    },
};
