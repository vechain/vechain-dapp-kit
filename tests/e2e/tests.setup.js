require('ts-node').register({
    transpileOnly: true,
    require: ['tsconfig-paths/register'],
    compilerOptions: {
        module: 'commonjs',
        baseUrl: 'src',
    },
});
