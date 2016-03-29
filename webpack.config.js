var webpackConfig = {
    context: __dirname + "/src",
    entry: {
        reren: "./index"
    },
    output: {
        path: __dirname + "/dist",
        filename: '[name].js',
        library: 'Reren',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {test: /\.jsx?$/, exclude: [/node_modules/], loader: "babel-loader"}
        ]
    }
};

module.exports = webpackConfig;