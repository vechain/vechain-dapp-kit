const Config = require('@vechain/repo-config');

module.exports = {
    ...Config.EslintLibrary,
    rules: {
        'func-style': 'off',
        'func-names': 'off',
        'prefer-arrow-callback': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/consistent-type-imports': 'off',
    },
};
