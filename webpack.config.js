const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, options) => {
  const isProd = options.mode === "production";

  return {
    entry: isProd ? "./lib/index.ts" : "./examples/src/main.tsx",
    devtool: isProd ? "source-map" : "eval-source-map",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd ? "index.js" : "[name].js",
      clean: true,
      library: {
        name: "CoreUI",
        type: "umd",
      },
      globalObject: "this",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: "ts-loader",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      !isProd &&
        new HtmlWebpackPlugin({
          template: "./examples/public/index.html",
        }),
    ].filter(Boolean),
    externals: isProd
      ? {
          react: "react",
          "react-dom": "react-dom",
        }
      : {},

    optimization: {
      minimize: isProd,
      splitChunks: !isProd ? { chunks: "all" } : false,
    },
  };
};
