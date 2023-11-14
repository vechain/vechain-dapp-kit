const Config = require('@vechain/repo-config');

module.exports = {
    ...Config.EslintLibrary,
    ignorePatterns: ['**/test/**', 'vite.config.ts'],
};
