const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const fs = require("fs");

module.exports = (env) => {
  let mode = "development";
  if (env.NODE_ENV === "prod") {
    devtool = "hidden-source-map";
    mode = "production";
    stats = "none";
  }
  let htmlPlugin = new HtmlWebpackPlugin({
    templateParameters: (compilation, assets, assetTags, options) => {
      //FIXME: only insert chunk if html path matches chunk name -- surely there is a better way to do this, but I haven't found it
      console.log("options: ", options);
      let chunkId = options.filename.split("/")[0];
      assetTags.headTags = assetTags.headTags.filter((tag) => {
        console.log("tag: ", tag);
        return tag.attributes.src.indexOf(chunkId) > 0;
      });

      return {
        compilation,
        webpackConfig: compilation.options,
        htmlWebpackPlugin: {
          tags: assetTags,
          files: assets,
          options,
        },
        chunkId,
      };
    },
    title: "The Tower",
    template: path.join(__dirname, "/src/html/index.html"),
    path: path.resolve(__dirname, "./dist/"),
    filename: "./index.html",
    inject: false,
  });
  return {
    entry: { main: "./src/js/app.js", vender: "./src/js/app/main.js" },
    mode: mode,
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "[name]/[name].js",
    },
    resolve: {
      extensions: [".js", ".css", ".jpg", ".png", ".stl", ".wav"],
      modules: [path.resolve(__dirname, "src/public"), path.resolve(__dirname, "src/js"), path.resolve(__dirname, "src"), path.resolve(__dirname, "node_modules"), path.resolve(__dirname, "src/js/[name]")],
      fallback: {
        fs: false,
        os: false,
        path: false,
        "webworker-threads": false,
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        __ENV__: JSON.stringify(env.NODE_ENV),
      }),
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
      new MiniCssExtractPlugin({
        filename: "[name].bundle.css",
        chunkFilename: "[id].css",
      }),
      new webpack.HotModuleReplacementPlugin(),
      htmlPlugin,
    ],
    devServer: {
      static: "./src/public/",
      hot: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
      },
    },
    module: {
      rules: [
        {
          test: "/.json$/",
          loader: "json-loader",
        },
        {
          test: /\.(jsx|js)$/,
          include: path.resolve(__dirname, "src/js"),
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [
                  [
                    "@babel/preset-env",
                    {
                      targets: {
                        node: "12",
                      },
                    },
                  ],
                  "@babel/preset-react",
                ],
              },
            },
          ],
        },
        {
          test: /\.(frag|vert)/i,
          use: "raw-loader",
        },
        {
          test: /\.css$/i,
          include: path.resolve(__dirname, "src"),
          exclude: /node_modules/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  config: "./postcss.config.js",
                },
              },
            },
          ],
        },
        {
          test: /\.(jpg|png|stl)$/i,
          use: [
            {
              loader: "url-loader",
              options: {
                publicPath: "/the-tower/",
              },
            },
          ],
        },
      ],
    },
  };
};
