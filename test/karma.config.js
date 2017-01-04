const webpackConfig = require('./../webpack.config.js');
webpackConfig.entry = {};

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['mocha'],

    reporters: ['progress'],
    port: 9876,
    colors: false,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    autoWatchBatchDelay: 300,

    files: [
      // './../src/main.js',
      './specs/**/*.spec.js'
    ],

    preprocessors: {
      './../src/main.js': ['webpack'],
      './specs/**/*.spec.js': ['webpack']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true
    },

    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        plugins: ['transform-es2015-modules-umd'],
        sourceMap: 'inline'
      }
    },

    plugins: [
      require('karma-webpack'),
      require('karma-babel-preprocessor'),
      require('karma-mocha')
    ]
  });
};