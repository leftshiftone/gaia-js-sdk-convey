const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

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
        test: /\.csv$/,
        loader: 'csv-loader',
        options: {
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true,
        },
      },
      {
        test: /\.(css|scss)$/,
        use: [
          argv.mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: { minimize: true },
          },
          {
            loader: 'sass-loader',
          },
          'import-glob-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    library: 'GaiaSDK',
    libraryTarget: 'umd',
    libraryExport: 'default',
    filename: 'dist/[name].min.js',
    path: __dirname,
  },
  plugins: [
    new StyleLintPlugin({
      files: ['src/**/*.scss'],
    }),
    new MiniCssExtractPlugin({
      filename: 'dist/[name].min.css',
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.min\.css$/g,
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
  optimization: {
    splitChunks: {
      chunks: chunk => !chunk.name.endsWith('-all'),
    },
  },
});
