const gulp = require('gulp');
const eslint = require('gulp-eslint');
const sassLint = require('gulp-sass-lint');
var check = require('gulp-check');//To check for regular expression for multiple class names
var util = require('gulp-util');
var classPrefix =require('gulp-class-prefix');
var prefixhtml= require('gulp-replace');
var html_pre=require('./html-preceede');
var partnername="partnername";
var transform = require('vinyl-transform')
var map = require('map-stream')
var sass=require('gulp-sass');
//Initialize class names from here
//For JavaScript
gulp.task('lint', () => {
     
    return gulp.src('javascript/*.js')

         
        .pipe(eslint())
        
        .pipe(eslint.format())
         
        .pipe(eslint.failAfterError());
});
//For css
gulp.task('sass', function () {
  return gulp.src('sass/**/*.s+(a|c)ss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    
    .pipe(sassLint.failOnError())
});

 //For parsing and checking
gulp.task('check', function () {
  var n="outer";
  gulp.src(['sass/**/*.s+(a|c)ss'])
    .pipe(check(/(?!n)/))
    .on('error', function (err) {
      util.beep();
      util.log(util.colors.red(err));
    });
});

//For modifying html class names for partners

gulp.task('changehtml', function() {
  var change_html = transform(function(filename) {
    return map(function(chunk, next) {
      return next(null, "<div class="+partnername+">\n"+chunk.toString()+"\n</div>")
    })
  })
  gulp.src('html/*.html')
    .pipe(change_html)
    .pipe(gulp.dest('html/'))
})

//For modifying sass class name for partners
gulp.task('changesass', function() {
  var change = transform(function(filename) {
    return map(function(chunk, next) {
      return next(null, "."+partnername+"{\n"+chunk.toString()+"}")
    })
  })
  gulp.src('sass/**/*.s+(a|c)ss')
    .pipe(change)
    .pipe(gulp.dest('sass/'))
})


gulp.task('changecss', function() {
  var changes = transform(function(filename) {
    return map(function(chunk, next) {
      return next(null, "."+partnername+"{\n"+chunk.toString()+"}")
    })
  })
  gulp.src('css/**/*.css')
    .pipe(changes)
    .pipe(sass())
    .pipe(gulp.dest('dist/css/'))
})
//Add Class Name Before css
gulp.task('html_pre', function () {
  return gulp.src(['html/*.html'])
    .pipe(html_pre())
    .pipe(gulp.dest('html'));
});
gulp.task('default', ['lint','sass'], function () {
    
});