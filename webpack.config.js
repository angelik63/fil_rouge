const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const LicensePlugin = require('webpack-license-plugin');
const purgecss = require('@fullhuman/postcss-purgecss')


let config = {
  entry: {
    theme: ['./assets/scripts/base.js', './assets/styles/base.scss'],
    // error: ['./scss/pages/error.scss'],
  },
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: '[name].js',
  },
  resolve: {
    preferRelative: true,
  },
  stats: {
    children: true,
  },
  module: {
    rules: [
      {
        test: /\.js/,
        loader: 'esbuild-loader',
      },
      {
        test: /\.scss$/,
        use:[
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ],
      },
      {
        test: /.(png|woff(2)?|eot|otf|ttf|svg|jpg|jpeg|gif)(\?[a-z0-9=\.]+)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'dist/css/[hash][ext]',
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [

    new MiniCssExtractPlugin({filename: path.join('..', 'css', '[name].css')}),
    new CssoWebpackPlugin({
      forceMediaMerge: true,
    }),
    new LicensePlugin({ 
      outputFilename: 'thirdPartyNotice.json',
      licenseOverrides: {
        'bootstrap-touchspin@3.1.1': 'Apache-2.0',
      },
      replenishDefaultLicenseTexts: true,
    })
  ]
};

if (process.env.NODE_ENV === 'production') {
  config.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
      }),
    ],
  };
}

module.exports = config;