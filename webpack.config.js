var webpack = require("webpack");

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
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ],
    module: {
        loaders: [
            {test: /\.jsx?$/, exclude: [/node_modules/], loader: "babel-loader"}
        ]
    }
};

module.exports = webpackConfig;