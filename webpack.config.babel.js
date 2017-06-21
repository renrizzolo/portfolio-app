import path from 'path';
import StatsPlugin from 'stats-webpack-plugin';
import fs from 'fs';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpack from 'webpack';

const nodeModules = {};
fs.readdirSync(path.join(__dirname, 'node_modules'))
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach(mod => nodeModules[mod] = `commonjs ${mod}`);

const extractTextPlugin = new ExtractTextPlugin('[name].css');
extractTextPlugin.options.allChunks = true;

const config = server => ({
  entry: {
   app: ['babel-polyfill','fetch-everywhere', path.join(__dirname, 'src', (server ? 'app.js' : 'client.js'))]
  },

  output:{
    path: server ? path.join(__dirname, 'build', 'server') : path.join(__dirname, 'build', 'public'),
    filename: '[name].js',
    chunkFilename: '[id].[hash].js',
    publicPath: '/',
    libraryTarget: (server ? 'commonjs2' : 'var')
  },

  externals: (server ? nodeModules : {}),

  devtool: 'cheap-module-inline-source-map',

  ...(server ? {target: 'node'} : {}),

  resolve: {
    extensions: ['.js', '.jsx']
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      { test: /\.css$/, 
        exclude: /node_modules/,
        loader: extractTextPlugin.extract(['css-loader', 'postcss-loader']),
      },
      { test: /\.(gif|png|jpg)$/, loader: 'file-loader' }
    ]
  },

  plugins: [
    new StatsPlugin('stats.json', {
      chunkModules: true,
      exclude: [/node_modules/]
    }),
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: JSON.stringify('production')
    //   }
    // }),
    extractTextPlugin,
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    //new webpack.optimize.AggressiveMergingPlugin()
  ]

});
  if (process.env.NODE_ENV == 'production') {
   //
  }
//export separate server and public builds
module.exports = [config(true), config(false)];
