const Config = require('@vechain/repo-config');

module.exports = {
    ...Config.EslintReact,
    ignorePatterns: [...Config.EslintReact.ignorePatterns, 'src/hardhat/**/*'],
};
