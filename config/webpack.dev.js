  /* eslint import/no-extraneous-dependencies: 0 */
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.base.js');
const ip = require('ip');

module.exports = env => webpackMerge(commonConfig(env), {
  devtool: 'cheap-module-source-map',
  devServer: {
    port: 3001,
    host: ip.address(),
    historyApiFallback: true,
    noInfo: false,
    stats: 'minimal',
    publicPath: '',
    proxy: {
      '/uam': {
        changeOrigin: true,
        // target: 'https://www.lingtouniao.com',
        target: 'http://192.168.18.194:8080'
        // pathRewrite: { '^/v3': '' }
      },
      '/luam': {
        changeOrigin: true,
        // target: 'https://www.lingtouniao.com',
        target: 'http://192.168.18.194:8080'
        // pathRewrite: { '^/v3': '' }
      },
      '/v3': {
        changeOrigin: true,
        // target: 'https://www.lingtouniao.com',
        target: 'http://192.168.18.194:8080'
        // pathRewrite: { '^/v3': '' }
      },
      '/newmobile': {
        changeOrigin: true,
        // target: 'https://www.lingtouniao.com',
        target: 'http://192.168.18.194:8080'
        // pathRewrite: { '^/v3': '' }
      },
      '/native': {
        changeOrigin: true,
        // target: 'https://www.lingtouniao.com',
        target: 'http://192.168.18.194:8080'
        // pathRewrite: { '^/v3': '' }
      }
    }
  }
});
