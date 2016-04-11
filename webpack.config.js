var webpack = require('webpack')
var path = require('path')

module.exports = {
  entry: {
    app: ['./lib/entry.js']
  },
  output: {
    path: path.resolve(__dirname, 'public', 'cache'),
    publicPath: 'cache/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        text: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: [ 'es2015' ]
        }
      },
      {
        test: /\.scss$/,
        loaders: [ 'style', 'css', 'sass' ]
      }
    ]
  }
}
