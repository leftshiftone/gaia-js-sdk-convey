const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = (env, argv) => ({
    entry: {
        'gaia-js-sdk-convey-std': './src/std.ts',
        'gaia-js-sdk-convey-all': './src/all.ts',
        'gaia-js-sdk-convey-cal': './src/cal.ts',
        'gaia-js-sdk-convey-map': './src/map.ts',
        'gaia-js-sdk-convey-vis': './src/vis.ts',
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
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
        extensions: ['.ts', '.js'],
    },
    output: {
        library: '',
        libraryTarget: 'commonjs',
        filename: 'dist/[name].min.js',
        path: __dirname,
    },
    externals: [nodeExternals()],
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'dist/[name].min.css',
        }),
    ],
});
