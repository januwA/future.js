const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyFilePlugin = require("webpack-copy-file-plugin");

// 最小化生产
const TerserJSPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "development", // production or development
  entry: {
    future: path.resolve(__dirname, "src/index.ts")
  },
  // devtool: "inline-source-map", // 生成map文件
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"],

    // 如果要配置路径别名，就在/tsconfig.json里面配置
    alias: {}
  },
  optimization: {
    minimizer: [new TerserJSPlugin({})]
  },
  plugins: [
    new CleanWebpackPlugin()
    // new CopyFilePlugin(["./README.md"].map(f => path.resolve(__dirname, f)))
  ],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, 'dist'),
    library: "Future",
    libraryTarget: "umd",
    globalObject: "this"
  }
};
