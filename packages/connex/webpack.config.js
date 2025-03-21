const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')

const baseConfig = {
    entry: './esm/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd'
    },
    resolve: {
        fallback: {
            crypto: require.resolve("crypto-browserify"),
            buffer: require.resolve('buffer/'),
            url: require.resolve('url/'),
            stream: require.resolve('stream-browserify'),
            http: require.resolve('./dummy-http-agent'),
            https: require.resolve('./dummy-http-agent')
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        })
    ],
    mode: 'production',
    devtool: 'source-map',
    performance: {
        hints: false
    }
}

module.exports = [{
    ...baseConfig,
    output: {
        ...baseConfig.output,
        filename: 'connex.js'
    },
    optimization: { minimize: false }
},
{
    ...baseConfig,
    output: {
        ...baseConfig.output,
        filename: 'connex.min.js'
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                    keep_classnames: true
                }
            }),
        ]
    }
}]
