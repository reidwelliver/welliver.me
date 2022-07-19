const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const common = require("./common");

module.exports = {
  ...common,
  devtool: "inline-source-map",
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      title: "development",
      template: path.resolve("html", "index.dev.html"),
    }),
    new ForkTsCheckerWebpackPlugin(),
    new ReactRefreshWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [require.resolve("react-refresh/babel")],
              rootMode: "upward",
            },
          },
        ],
      },
      ...common.module.rules,
    ],
  },
  output: {
    path: "/",
    publicPath: "/",
    filename: "[name].pkg.js",
    chunkFilename: "[name].pkg.js",
  },
  devServer: {
    hot: true,
    port: 3000,
    historyApiFallback: true,
  },
};
