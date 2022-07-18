const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
  resolve: {
    modules: [path.join(__dirname, "..", "node_modules")],
    alias: {
      "@welliver-me/frontend": path.resolve(__dirname, "..", "src"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
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
