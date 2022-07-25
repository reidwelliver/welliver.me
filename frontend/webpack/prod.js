const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const common = require("./common");

module.exports = {
  ...common,
  mode: "production",
  optimization: {
    minimize: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "development",
      template: path.resolve("html", "index.prod.html"),
    }),
    new ForkTsCheckerWebpackPlugin(),
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
              rootMode: "upward",
            },
          },
        ],
      },
      ...common.module.rules,
    ],
  },
  output: {
    path: path.resolve("dist"),
    filename: "[name].pkg.js",
    publicPath: "/",
    chunkFilename: "[name].pkg.js",
  },
  externals: [
    {
      react: "React",
      "react-dom": "ReactDOM",
    },
  ],
};
