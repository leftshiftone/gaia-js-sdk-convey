const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const { resolve } = require('path');

module.exports = (env, argv) => ({
  entry: {
    'gaia-js-sdk-convey-all': './src/all.ts',
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
    path: resolve(__dirname, 'dist'),
    filename: 'gaia-sdk-convey.js',
  },
  plugins: [
    new StyleLintPlugin({
      files: ['src/**/*.scss'],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].min.css',
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
