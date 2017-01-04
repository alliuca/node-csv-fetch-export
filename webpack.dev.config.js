'use strict';

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = require('./config');

var env = process.env.NODE_ENV;
var port = config.APP_PORT;

module.exports = {
  devtool: '#eval-source-map',
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    config.APP_SRC + '/main.js'
  ],
  output: {
    path: '/',
    filename: 'app.js',
    publicPath: `http://localhost:${port}/scripts/`
  },
  resolve: {
    alias: { vue: 'vue/dist/vue.js' }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015'] }
        }],
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        use: [{
          loader: 'vue-loader',
          options: {
            js: 'babel',
            postcss: [
              require('autoprefixer')({
                browsers: ['last 2 versions']
              })
            ]
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: true
    })
  ],
  target: 'web'
};