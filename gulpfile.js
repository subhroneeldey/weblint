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
var access = require('gulp-accessibility');
var checkangular=require("./Angulardependency");
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
gulp.task('parse_css', function () {
  var n="outer";
  gulp.src(['sass/**/*.s+(a|c)ss'])
    .pipe(check(/(^|}[\n\s]*)[\s]*[\.][\s]*(?!partnername)[a-zA-Z1234567890_-]+((\s[a-zA-Z1234567890_-\s]+{)|[\s]*{)/gm))
    .on('error', function (err) {
      util.beep();
      util.log(util.colors.red(err));
    });
});
// for multiple classes sharing parsing and sharing
gulp.task('parse_css2', function () {
  var n="outer";
  gulp.src(['sass/*.s+(a|c)ss'])
    .pipe(check(/\.partnername\..+{/gm))
    .on('error', function (err) {
      util.beep();
      util.log(util.colors.red(err));
    });
});

//For accessibility

gulp.task('test', function() {
  return gulp.src(['./**/*.html','./**/*.js'])
    .pipe(access({
      force: true
    }))
    .on('error', console.log)
    .pipe(access.report({reportType: 'txt'}))
    .pipe(rename({
      extname: '.txt'
    }))
    .pipe(gulp.dest('reports/txt'));
});




//To prevent overwriting of libraries and check for dependencies
gulp.task('checkdependency', function() {
  var checkdepen = transform(function(filename) {
    return map(function(chunk, next) {
      return next(null, checkangular(chunk.toString()))
    })
  })
  gulp.src('javascript/*.js')
    .pipe(checkdepen)
    
})



gulp.task('default', ['lint','sass','test','parse_css','parse_css2','test','checkdependency'], function () {
    
});