module.exports = {
    default: {
        paths: ['./src/features/*.feature'],
        require: ['./tests.setup.js', './src/**/*.ts'],
        requireModule: ['ts-node/register'],
        formatOptions: {
            snippetInterface: 'synchronous',
        },
        format: ['@serenity-js/cucumber'],
    },
};
