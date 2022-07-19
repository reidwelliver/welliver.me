const path = require("path");

const TOP_LEVEL_DIRECTORY = path.join(__dirname, "..", "..");

module.exports = {
  entry: "./index.tsx",
  resolve: {
    modules: [TOP_LEVEL_DIRECTORY, path.join(__dirname, "..", "node_modules")],
    alias: {
      "@welliver.me": TOP_LEVEL_DIRECTORY,
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".scss"],
  },
  module: {
    rules: [
      {
        test: /\.(ttf|eot|svg|xlsx|png|jpg|gif|woff)(\?[a-z0-9#=&.]+)?$/,
        use: [{ loader: "file-loader" }],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" },
        ],
      },
    ],
  },
};
