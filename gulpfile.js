const gulp = require('gulp');
const eslint = require('gulp-eslint');
const sassLint = require('gulp-sass-lint');
var check = require('gulp-check');//To check for regular expression for multiple class names
var util = require('gulp-util');
var classPrefix =require('gulp-class-prefix');
var prefixhtml= require('gulp-replace');
var partnername="partnername";
var transform = require('vinyl-transform')
var map = require('map-stream')
var sass=require('gulp-sass');
var access = require('gulp-accessibility');
var checkangular=require("./Angulardependency");
let rename = require("gulp-rename");
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var gulpStylelint = require('gulp-stylelint');

//Initialize class names from here
//For JavaScript
gulp.task('lint', () => {
     
    return gulp.src('javascript/**/*.js')

         
        .pipe(eslint())
        
        .pipe(eslint.format())
         
        .pipe(eslint.failAfterError());
});
//For linting scss and sass
gulp.task('sasslinting', function () {
  return gulp.src('sass/**/*.s+(a|c)ss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    
    .pipe(sassLint.failOnError())
});
//For linting css
gulp.task('lint-css', function lintCssTask() {
    return gulp.src('./**/*.css')
    .pipe(gulpStylelint({
      reporters: [
        {formatter: 'string', console: true}
      ],
      config : {  "extends": "stylelint-config-standard"}
    }));
});



 //For parsing and checking
function checkcss(chunk){
    util.log(util.colors.red("These classes should be prefixed with partnername : "));
    let test = chunk.match(/(^|}[\n\s]*)[\s]*(\.|#)[\s]*(?!partnername)[a-zA-Z1234567890_-]+((\s[a-zA-Z1234567890_-\s]+{)|[\s]*{)/gm).toString();//Change Partnername in the regex as required
      test = test.replace(/[},{\.\s]/g,' ');
   util.log(util.colors.yellow(test));
}
gulp.task('check-css-classname', function() {
  var checkdepen = transform(function(filename) {
    return map(function(chunk, next) {
      return next(null, checkcss(chunk.toString()))
    })
  })
  gulp.src('sass/**/*.s+(a|c)ss')
    .pipe(checkdepen)
    
})
// for multiple classes sharing parsing and sharing
function checkcss2(chunk){
    //util.log(util.colors.red("These classes don't start with partnername : "));
    let test = chunk.match(/(\.|#)partnername\..+{/gm).toString();//Change Partnername in the regex as required
      test = test.replace(/[},{\.\s]/g,' ');
   util.log(util.colors.yellow(test));
}
gulp.task('check-css-classname2', function() {
  var checkdepen = transform(function(filename) {
    return map(function(chunk, next) {
      return next(null, checkcss2(chunk.toString()))
    })
  })
  gulp.src('sass/**/*.s+(a|c)ss')
    .pipe(checkdepen)
    
})
//For accessibility
gulp.task('test-accessibility', function() {
  return gulp.src(['./**/*.html','./**/*.css'])
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
gulp.task('default', [], function () {
    runSequence(['lint','lint-css','sasslinting','checkdependency'],'check-css-classname','check-css-classname2','test-accessibility')
});