var gulp = require('gulp');
var gulpUtil = require("gulp-util");
var webpack = require('webpack');

gulp.task("compilejs", function() {


    var webpackConfig = {
        context: __dirname + "/src",
        entry: {
            reren: "./index"
        },
        output: {
            path: __dirname + "/dist",
            filename: '[name].js'
        },
        watch: true,
        module: {
            loaders: [
                {test: /\.jsx?$/, exclude: [/node_modules/], loader: "babel-loader"}
            ]
        }
    };

    webpack(webpackConfig, function (err, stats) {
            if (err) throw new gulpUtil.PluginError("webpack", err);

            gulpUtil.log("[webpack]", stats.toString({
                chunks: false,
                colors: true

            }));
        });
});
gulp.task("watch", function() {
    gulp.watch("./src/**/*.js", ["compilejs"]);
});

gulp.task("default", ["compilejs", "watch"]);