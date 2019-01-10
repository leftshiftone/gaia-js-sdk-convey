const webpack = require('webpack');
// plugins
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const cssnano = require('cssnano');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
// required for variables defined in js and then used in sass
const sass = require('node-sass');
const sassUtils = require('node-sass-utils')(sass);

module.exports = (env, argv) => ({
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                use: [
                    {
                        loader: 'tslint-loader',
                        options: {
                            fix: false,
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
            },
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    argv.mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                    {
                        loader: 'css-loader',
                        options: { minimize: true }
                    },
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            functions: {
                                'get($keys)': (keys) => {
                                    const keyList = keys.getValue()
                                        .split('.');
                                    let result = sassVars;
                                    keyList.forEach((key) => {
                                        result = result[key];
                                    });
                                    result = sassUtils.castToSass(result);
                                    return result;
                                },
                            },
                        },
                    },
                    'import-glob-loader',
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        library: 'GaiaSDK',
        libraryTarget: 'umd',
        libraryExport: 'default',
        filename: 'dist/gaia-js-sdk-convey.min.js',
        path: __dirname,
    },
    plugins: [
        new StyleLintPlugin({
            files: ['src/**/*.scss'],
        }),
        new MiniCssExtractPlugin({
            filename: 'dist/gaia-js-sdk-convey.min.css',
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.min\.css$/g,
            cssProcessor: cssnano,
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true,
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    node: {
        global: true,
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },
});
