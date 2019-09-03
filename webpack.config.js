const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => ({
    entry: {
        'gaia-js-sdk-convey-std': './src/std.wpk.ts',
        'gaia-js-sdk-convey-all': './src/all.wpk.ts',
        'gaia-js-sdk-convey-map': './src/map.wpk.ts',
        'gaia-js-sdk-convey-vis': './src/vis.wpk.ts',
        'gaia-js-sdk-convey-aud': './src/aud.wpk.ts',
        'gaia-js-sdk-convey-cod': './src/cod.wpk.ts',
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
                    inlineSources: false,
                    sourceMap: false
                }
            },
            {
                test: /\.(css|scss)$/,
                exclude: /node_modules/,
                use: [
                    argv.mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    'sass-loader',
                    'import-glob-loader'
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
        library: 'GaiaConvey',
        libraryTarget: 'umd',
        filename: 'dist/[name].js',
        path: __dirname,
        umdNamedDefine: true,
        // see: https://github.com/webpack/webpack/issues/6784
        globalObject: 'typeof self !== \'undefined\' ? self : this'
    },
    externals: ['leaflet', '@zxing/library', 'reveal.js', 'browser-image-compression'],
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'dist/[name].css',
        }),
    ],
});
