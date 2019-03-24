// const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var webpackConfig = {
    context: __dirname + "/src",
    entry: {
        "reren": "./index",
        "reren.min": "./index"
    },
    output: {
        path: __dirname + "/dist",
        filename: '[name].js',
        library: 'Reren',
        libraryTarget: 'umd'
    },
    plugins: [

    ],
    module: {
        rules: [
            {
              enforce: "pre",
              test: /\.js$/,
              exclude: /node_modules/,
              loader: "eslint-loader"
            },
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: "babel-loader"
            }
          ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                include: /\.min\.js$/,
                // minimize: true
            })
        ]
    }
};

module.exports = webpackConfig;