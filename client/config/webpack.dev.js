const { merge } = require('webpack-merge');

const common = require('./webpack.common');

const CSSLoader = {
  loader: 'css-loader',
  options: {
    modules: 'global',
    importLoaders: 2,
    sourceMap: true,
  },
};

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
    hot: true,
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          CSSLoader,
          { loader: 'postcss-loader', options: { sourceMap: true } },
        ],
      },
    ],
  },
});
