const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    vendor: ['packages'],
    'vant-docs': './docs/src/index.js',
    'vant-examples': './docs/src/examples.js'
  },
  output: {
    path: path.join(__dirname, '../docs/dist'),
    publicPath: '/',
    filename: '[name].js',
    umdNamedDefine: true,
    chunkFilename: 'async_[name].js'
  },
  devServer: {
    host: '0.0.0.0',
    historyApiFallback: {
      rewrites: [
        { from: /^\/zanui\/vant\/examples/, to: '/examples.html' },
        { from: /^\/zanui\/vant/, to: '/index.html' }
      ]
    },
    stats: 'errors-only'
  },
  resolve: {
    modules: [path.join(__dirname, '../node_modules'), 'node_modules'],
    extensions: ['.js', '.vue', '.css'],
    alias: {
      vue: 'vue/dist/vue.runtime.esm.js',
      packages: path.join(__dirname, '../packages'),
      lib: path.join(__dirname, '../lib'),
      components: path.join(__dirname, '../docs/src/components')
    }
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              preserveWhitespace: false,
              extractCSS: true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules|vue-router\/|vue-loader\//,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            'css-loader',
            'postcss-loader'
          ]
        })
      },
      {
        test: /\.md/,
        use: [
          'vue-loader',
          'fast-vue-md-loader'
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader'
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    new ProgressBarPlugin(),
    new HtmlWebpackPlugin({
      chunks: ['vendor', 'vant-docs'],
      template: 'docs/src/index.tpl',
      filename: 'index.html',
      inject: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['vendor', 'vant-examples'],
      template: 'docs/src/index.tpl',
      filename: 'examples.html',
      inject: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: 2,
      filename: isProduction ? 'vendor.[hash:8].js' : 'vendor.js'
    }),
    new ExtractTextPlugin({
      filename: isProduction ? '[name].[hash:8].css' : '[name].css',
      allChunks: true
    }),
    new FriendlyErrorsPlugin()
  ]
};
