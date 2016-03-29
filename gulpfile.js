var gulp = require('gulp');
var gulpUtil = require("gulp-util");
var webpack = require('webpack');
var eslint = require('gulp-eslint');
var webpackConfig = require('./webpack.config.js');

gulp.task('eslint', function () {
    return gulp.src(['./src/**/*.j*', './__tests__/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task("compilejs", function() {
    webpack(webpackConfig, function (err, stats) {
        if (err) throw new gulpUtil.PluginError("webpack", err);

        gulpUtil.log("[webpack]", stats.toString({
            chunks: false,
            colors: true

        }));
    });
});

gulp.task("watch", function() {
    gulp.watch(["./src/**/*.js", "./__tests__/**/*.js"], ["compilejs", "eslint"]);
});

gulp.task("default", ["compilejs", "eslint", "watch"]);