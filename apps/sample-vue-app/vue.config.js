const { defineConfig } = require('@vue/cli-service');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
module.exports = defineConfig({
    publicPath:
        process.env.NODE_ENV === 'production' ? '/vechain-dapp-kit/vue/' : '/',
    transpileDependencies: true,
    configureWebpack: {
        plugins: [new NodePolyfillPlugin()],
        optimization: {
            splitChunks: {
                chunks: 'all',
            },
        },
    },
});
