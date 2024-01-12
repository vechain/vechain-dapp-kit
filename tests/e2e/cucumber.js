module.exports = {
    default: {
        paths: ['./src/features/*.feature'],
        require: ['./tests.setup.js', './src/**/*.ts'],
        formatOptions: {
            snippetInterface: 'synchronous',
        },
        publishQuiet: true,
    },
};
