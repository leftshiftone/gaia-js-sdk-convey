const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { resolve } = require('path');

module.exports = (env, argv) => ({
  entry: './src/all.ts',
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
    path: resolve(__dirname, 'dist'),
    filename: 'gaia-sdk-convey.js',
  },
  externals: ['d3', 'mqtt', 'leaflet', 'google-maps', 'node-ical'],
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/gaia-sdk-convey.min.css',
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
});
