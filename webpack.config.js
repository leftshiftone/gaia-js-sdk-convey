const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = (env, argv) => ({
    entry: {
        'gaia-js-sdk-convey-std': './src/std.ts',
        'gaia-js-sdk-convey-all': './src/all.ts',
        'gaia-js-sdk-convey-cal': './src/cal.ts',
        'gaia-js-sdk-convey-map': './src/map.ts',
        'gaia-js-sdk-convey-vis': './src/vis.ts',
        'gaia-js-sdk-convey-aud': './src/aud.ts'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/,
                query: {
                    // we don't want any declaration file in the bundles
                    // folder since it wouldn't be of any use ans the source
                    // map already include everything for debugging
                    declaration: false,
                }
            },
            {
                test: /\.(css|scss)$/,
                exclude: /node_modules/,
                use: [
                    argv.mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    'sass-loader',
                    'import-glob-loader',
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.scss'],
    },
    // Activate source maps for the bundles in order to preserve the original
    // source when the user debugs the application
    devtool: 'source-map',
    output: {
        library: 'gaia-js-sdk-convey',
        globalObject: 'typeof self !== "undefined" ? self : this',
        libraryTarget: 'umd',
        filename: 'dist/[name].js',
        path: __dirname,
        umdNamedDefine: true
    },
    externals: [nodeExternals()],
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'dist/[name].css',
        }),
    ],
});
