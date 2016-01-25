var gulp = require('gulp');
var jslint = require('gulp-jslint');
var gulpUtil = require("gulp-util");
var webpack = require('webpack');
var eslint = require('gulp-eslint');

gulp.task('eslint', function () {
    return gulp.src([
        './src/**/*.j*',
        './__tests__/**/*.js'
    ]).pipe(eslint())
        .pipe(eslint.format());
});

gulp.task("compilejs", function() {

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
    gulp.watch([
        "./src/**/*.js",
        "./__tests__/**/*.js"
    ], ["compilejs", "eslint"]);
});

gulp.task("default", ["compilejs", "eslint", "watch"]);