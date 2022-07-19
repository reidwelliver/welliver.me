const path = require("path");

module.exports = {
  entry: "./index.tsx",
  resolve: {
    modules: [path.join(__dirname, "..", "node_modules")],
    alias: {
      "@welliver.me": path.join(__dirname, "..", ".."),
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
