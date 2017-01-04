'use strict';

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = require('./config');

var env = process.env.NODE_ENV;
var port = config.APP_PORT;

module.exports = {
  entry: {
    app: config.APP_SRC + '/main.js'
  },
  output: {
    path: config.APP_DIST,
    filename: '[name].js'
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
      template: 'index.html',
      inject: true
    })
  ],
  devtool: '#eval-source-map',
  devServer: {
    port: port,
    contentBase: config.APP_SRC
  }
};