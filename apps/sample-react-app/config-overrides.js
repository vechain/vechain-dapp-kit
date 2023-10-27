const path = require('node:path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const paths = require('react-scripts/config/paths');
const { overrideDevServer } = require('customize-cra');

paths.appSrc = path.resolve(__dirname, 'src');
// Tell the app that "src/index.tsx" has moved to "src/popup/index.tsx"
paths.appIndexJs = path.resolve(__dirname, 'src/index.tsx');

// Adds a manifest file to the build according to the current context,
// and deletes files from the build that are not needed in the current context
const devServerConfig = () => (config) => {
    return {
        ...config,
        // webpackDevService doesn't write the files to desk
        // so we need to tell it to do so so we can load the
        // extension with chrome
        hot: true,
        liveReload: true,
        devMiddleware: {
            writeToDisk: true,
        },
    };
};

module.exports = {
    webpack(config) {
        // Disable bundle splitting,
        // a single bundle file has to loaded as `content_script`.
        config.optimization.splitChunks = {
            cacheGroups: {
                default: false,
            },
        };

        // `false`: each entry chunk embeds runtime.
        // The extension is built with a single entry including all JS.
        // https://symfonycasts.com/screencast/webpack-encore/single-runtime-chunk
        config.optimization.runtimeChunk = false;

        config.entry = {
            // Main Entry
            main: './src/index.tsx',
        };

        // Filenames of bundles must not include `[contenthash]`, so that they can be referenced in `extension-manifest.json`.
        // The `[name]` is taken from `config.entry` properties, so if we have `main` and `background` as properties, we get 2 output files - main.js and background.js.
        config.output.filename = '[name].js';

        // `MiniCssExtractPlugin` is used by the default CRA webpack configuration for
        // extracting CSS into separate files. The plugin has to be removed because it
        // uses `[contenthash]` in filenames of the separate CSS files.
        config.plugins = config.plugins
            .filter((plugin) => !(plugin instanceof MiniCssExtractPlugin))
            .concat(
                // `MiniCssExtractPlugin` is used with its default config instead,
                // which doesn't contain `[contenthash]`.
                new MiniCssExtractPlugin(),
            );

        const fallback = config.resolve.fallback || {};
        Object.assign(fallback, {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            assert: require.resolve('assert'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            os: require.resolve('os-browserify'),
            url: require.resolve('url'),
            'process/browser': require.resolve('process/browser'),
        });
        config.resolve.fallback = fallback;

        config.plugins = (config.plugins || []).concat([
            new webpack.ProvidePlugin({
                process: 'process/browser',
                Buffer: ['buffer', 'Buffer'],
            }),
        ]);

        return config;
    },
    devServer: overrideDevServer(devServerConfig()),
};
