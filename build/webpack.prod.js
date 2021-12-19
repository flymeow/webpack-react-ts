const webpack = require("webpack");
const { merge } = require("webpack-merge");
const path = require("path");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
// const { extendDefaultPlugins } = require("svgo");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const base = require("./webpack.base");

const ROOT_PATH = path.resolve(__dirname, "./");
const DIST_PATH = path.resolve(ROOT_PATH, "./dist");

module.exports = merge(base, {
  mode: "production",
  devtool: false,
  output: {
    path: DIST_PATH,
    filename: "js/[name].[chunkhash:8].js",
    chunkFilename: "js/[name].[chunkhash:8].js",
  },
  plugins: [
    new webpack.ProgressPlugin({
      modulesCount: 5000,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:8].css",
      chunkFilename: "[name].[contenthash:8].chunk.css",
    }),
  ],
  optimization: {
    nodeEnv: "production",
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            // We want terser to parse ecma 8 code. However, we don't want it
            // to apply any minification steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending further investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          // Added for profiling in devtools
          // keep_classnames: isEnvProductionProfile,
          // keep_fnames: isEnvProductionProfile,
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            // eslint-disable-next-line camelcase
            ascii_only: true,
          },
        },
      }),
      // new ImageMinimizerPlugin({
      //   minimizerOptions: {
      //     // Lossless optimization with custom option
      //     // Feel free to experiment with options for better result for you
      //     plugins: [
      //       ["gifsicle", { interlaced: true }],
      //       ["jpegtran", { progressive: true }],
      //       ["optipng", { optimizationLevel: 5 }],
      //       // Svgo configuration here https://github.com/svg/svgo#configuration
      //       [
      //         "svgo",
      //         {
      //           name: "preset-default",
      //           params: {
      //             overrides: {
      //               // customize plugin options
      //               convertShapeToPath: {
      //                 convertArcs: true,
      //               },
      //               // disable plugins
      //               convertPathData: false,
      //             },
      //           },
      //           plugins: extendDefaultPlugins([
      //             {
      //               name: "removeViewBox",
      //               active: false,
      //             },
      //             {
      //               name: "addAttributesToSVGElement",
      //               params: {
      //                 attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
      //               },
      //             },
      //           ]),
      //         },
      //       ],
      //     ],
      //   },
      // }),
      new CssMinimizerPlugin(),
    ],
  },
});
