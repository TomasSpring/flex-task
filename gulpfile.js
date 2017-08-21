"use strict";

var gulp = require('gulp'),
  path = require('path'),
  data = require('gulp-data'),
  jade = require('gulp-jade'),
  less = require('gulp-less'),
  browserSync = require('browser-sync').create(),
  del = require('del');


var settings = {
  localDir: './release',
  htmlDir: './release/html',
  lessDir: './less',
  dataDir: './data',
  jadeFiles: './jade/pages/**/*.jade',
  lessFiles: './less/style.less',
  jsFiles: './js/**/*',
  imgFiles: './img/**/*',
  fontsFiles: './fonts/**/*'
};

/**
 * Compile .jade files and pass in data from json file
 * matching file name. index.jade - index.jade.json
 */
gulp.task('jade', function () {
  //var config = require('./data/flextask.json');

  gulp.src(settings.jadeFiles)
    .pipe(jade({
      //locals: config,
      pretty: true
    }))
    .pipe(gulp.dest(settings.htmlDir))
});

/**
 * Recompile .jade files and live reload the browser
 */
gulp.task('jade-rebuild', ['jade'], function () {
  browserSync.reload({stream: true});
});

/**
 * Wait for jade and sass tasks, then launch the browser-sync Server
 */
gulp.task('browser-sync', ['less', 'jade'], function () {
  browserSync.init({
    server: {
      baseDir: settings.localDir,
      index: "html/index.html"
    },
    notify: false
  });
});

/**
 * Compile .scss files into release css directory and then live reload the browser.
 */
gulp.task('less', function () {
  return gulp.src(settings.lessFiles)
    .pipe(less())
    .pipe(gulp.dest(settings.localDir + '/css'))
    .pipe(browserSync.reload({stream: true}));
});

/**
 * Copy js files into release js directory and then live reload the browser.
 */
gulp.task('js', function () {
  return gulp.src(settings.jsFiles)
    .pipe(gulp.dest(settings.localDir + '/js'))
    .pipe(browserSync.reload({stream: true}));
});

/**
 * Copy images into release img directory and then live reload the browser.
 */
gulp.task('img', function () {
  return gulp.src(settings.imgFiles)
    .pipe(gulp.dest(settings.localDir + '/css/img'))
    .pipe(browserSync.reload({stream: true}));
});

/**
 * Copy fonts into release fonts directory and then live reload the browser.
 */
gulp.task('fonts', function () {
  return gulp.src(settings.fontsFiles)
    .pipe(gulp.dest(settings.localDir + '/fonts'))
    .pipe(browserSync.reload({stream: true}));
});


/**
 * Watch scss files for changes & recompile
 * Watch .jade files run jade-rebuild then reload BrowserSync
 * Watch js files and images and copy hem to release folder
 */

gulp.task('watch', function () {
  gulp.watch(settings.sassFiles, ['sass']);
  gulp.watch(settings.ingenicoSassFiles, ['ingenico']);
  gulp.watch(settings.adyenSassFiles, ['adyenSass']);
  gulp.watch(settings.adyenJadeFiles, ['adyenJade']);
  gulp.watch(['*.jade', '**/*.jade'], ['jade-rebuild']);
  gulp.watch(settings.jsFiles, ['js']);
  gulp.watch(settings.imgFiles, ['img']);
  gulp.watch(settings.fontsFiles, ['fonts']);
});

/**
 * Clean release folder
 */
gulp.task('clean', function () {
  del.sync(['./release/**']);
});

/**
 * Default task, running just `gulp` will compile the sass, jade, launch BrowserSync
 */
gulp.task('default', ['browser-sync', 'watch']);

/**
 * Default task, running just `gulp` will compile the sass, jade, copy of js, img and fonts files, launch BrowserSync
 */
gulp.task('release', ['clean', 'jade', 'less', 'js', 'img', 'fonts' ]);
