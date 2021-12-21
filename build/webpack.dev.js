const { merge } = require('webpack-merge')
const path = require('path')

const base = require('./webpack.base')
const ROOT_PATH = path.resolve(__dirname, './')
const DIST_PATH = path.resolve(ROOT_PATH, './dist')
const PORT = 3000

module.exports = merge(base, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  output: {
    path: DIST_PATH,
    filename: 'js/[name].[chunkhash:8].js'
  },
  devServer: {
    host: 'localhost',
    port: PORT,
    hot: true,
    compress: true,
    open: true,
    historyApiFallback: true,
    onListening: function () {
      console.log('Listening on port:', PORT)
    },
    client: {
      overlay: {
        warnings: false,
        errors: true
      }
    },
    devMiddleware: {
      stats: {
        colors: true,
        hash: false,
        version: true,
        timings: true,
        assets: false,
        chunks: false,
        modules: false,
        publicPath: false
      }
    }
  }
})
