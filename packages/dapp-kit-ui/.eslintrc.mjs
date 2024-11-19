const Config = require('@vechain/repo-config');

module.exports = {
    ...Config.EslintReact,
    rules: {
        ...Config.EslintReact.rules,
        'import/no-extraneous-dependencies': 'error',
    },
};
