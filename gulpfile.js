var gulp = require('gulp');
var webpack = require('webpack-stream');
var config = require('config');
var serve = require('./app');

// Webpack
gulp.task('webpack', function () {
  return gulp.src('./src/app.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./dist'));
});

// Simple Server
gulp.task('serve:web', serve({
  root: './dist',
  port: config.get('server.port')
}));

// Watch for changes and reload stuff
gulp.task('watch', function () {
  gulp.watch('./src/**/*', ['webpack']);
});

gulp.task('default', ['webpack', 'serve:web', 'watch']);