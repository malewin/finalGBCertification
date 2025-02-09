const { override, addWebpackPlugin } = require("customize-cra");
const webpack = require("webpack");

module.exports = override(
  addWebpackPlugin(
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    })
  ),
  (config) => {
    config.resolve.fallback = {
      buffer: require.resolve("buffer"),
      // другие полифиллы, если требуются
    };
    return config;
  }
);
