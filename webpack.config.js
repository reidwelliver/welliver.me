var path = require( 'path' );
var webpack = require( 'webpack' );
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  devtool: 'eval-source-map',
  devServer: {
   headers: { "Access-Control-Allow-Origin": "*" }
  },
  entry: [
	'babel-polyfill',
	'react-hot-loader/patch',
    'webpack-dev-server/client?http://0.0.0.0:4200',
    'webpack/hot/dev-server',
    path.join(__dirname, 'src/index.js')
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
          template: 'src/index.html',
          inject: 'body',
          filename: 'index.html'
        }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
    {
      test: /\.(mp4|png|ogv|gif|webm|jpg)(\?[a-z0-9#=&.]+)?$/,
      loader: "file?name=[name].[ext]"
    },
    {
      test: /\.js$/,
      loaders: [ 'babel-loader' ],
      include: path.join(__dirname, 'src')
    },
    {
      test: /\.css$/,
      loader: "style-loader!css-loader"
	},
    {
      test: /\.less$/,
      loader: "style-loader!css-loader!less-loader"
    }
    ]
  },
  node: {
    console: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    console: true
  }
};
