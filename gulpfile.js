var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    order = require('gulp-order'),
    rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
	var files = [
    './style.css',
    './*.php'
    ];
  browserSync.init(files, {
    //browsersync with a php server
    proxy: "0.0.0.0:3000",
    notify: false
    });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('images', function(){
  gulp.src('public/src/imgs/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('public/dist/imgs/'));
});

gulp.task('styles', function(){
  gulp.src([
	    'public/src/scss/**/**/*.scss',
  		'public/src/scss/**/*.scss'
  	])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(gulp.dest('public/dist/css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('public/dist/css/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
  return gulp.src([
  		'public/src/js/vendors/jquery.min.js',
  		'public/src/js/vendors/before-after.min.js',
  		'public/src/js/app/*.js' 
  	])
  	.pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/dist/js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('public/dist/js/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('default', ['browser-sync','images','styles','scripts'], function(){
  gulp.watch("public/src/scss/**/*.scss", ['styles','images']);
  gulp.watch("public/src/js/**/*.js", ['scripts']);
  gulp.watch("*.html", ['bs-reload']);
});