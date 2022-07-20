const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const paths = require('./paths');
const tsconfig = require('../tsconfig.json');

module.exports = {
  entry: [paths.src + '/index.tsx'],
  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public,
          to: 'assets',
          globOptions: {
            ignore: ['*.DS_Store', '**/favicon.ico', '**/index.html'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      title: 'Todos',
      favicon: paths.public + '/favicon.ico',
      template: paths.public + '/index.html',
      filename: 'index.html',
    }),
  ],
  module: {
    rules: [
      { test: /\.(js|jsx|tsx|ts)$/, use: ['babel-loader'] },
      { test: /\.(tsx|ts)?$/, use: 'ts-loader' },
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },
      { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },
    ],
  },
  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.tsx', '.ts'],
    alias: Object.keys(tsconfig.compilerOptions.paths).reduce(
      (aliases, aliasName) => {
        aliases[aliasName.split('/')[0]] = path.resolve(
          paths.src,
          `${
            tsconfig.compilerOptions.paths[aliasName].includes('*')
              ? ''
              : tsconfig.compilerOptions.paths[aliasName][0].split('/')[0]
          }`
        );

        console.log(aliases);
        return aliases;
      },
      { assets: paths.public }
    ),
  },
};
