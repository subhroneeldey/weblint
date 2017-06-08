const gulp = require('gulp');
const eslint = require('gulp-eslint');
const sassLint = require('gulp-sass-lint');
var check = require('gulp-check');
var util = require('gulp-util');
var classPrefix = require('gulp-class-prefix');
var prefixhtml = require('gulp-replace');
var partnername = "partnername";
var transform = require('vinyl-transform')
var map = require('map-stream')
var sass = require('gulp-sass');
var access = require('gulp-accessibility');
var checkangular = require("./Angulardependency");
let rename = require("gulp-rename");
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var gulpStylelint = require('gulp-stylelint');
var fs = require('fs');
var eslint_wstream = fs.createWriteStream('reports/eslint-errors/lintingerrors.csv');
//var sasslint_wstream = fs.createWriteStream('reports/sasslint-errors/sass-lintingerrors.csv');
var css_path = "/**/*.css", html_path = "/**/*.html", js_path = "/**/*.js", sass_path = "/**/*.s+(a|c)ss";
//Reads source paths from analyser_config.json
gulp.task('readconfig', function () {
  var pathcontent = fs.readFileSync("analyser_config.json");
  var jsonpath = JSON.parse(pathcontent);
  css_path = jsonpath.cssRoot + "/**/*.css";
  html_path = jsonpath.htmlRoot + "/**/*.html";
  js_path = jsonpath.jsRoot + "/**/*.js";
  sass_path = jsonpath.sassRoot + "/**/*.s+(a|c)ss";

});
//For linting JavaScript files
gulp.task('lint', ['readconfig'], () => {
  return gulp.src(js_path)
    .pipe(eslint())
    .pipe(eslint.result(result  =>  {
              // Called for each ESLint result. 
              console.log(`ESLint result: ${result.filePath}`);
              console.log(`# Messages: ${result.messages.length}`);
              console.log(`# Warnings: ${result.warningCount}`);
              console.log(`# Errors: ${result.errorCount}`);
        }))
    .pipe(eslint.formatEach('stylish', eslint_wstream))
});

//For linting scss and sass
gulp.task('sasslinting', ['readconfig'], function () {
   var  file  =  fs.createWriteStream('reports/sass-linting-errors/lint_sass.csv');
   var  stream  =  gulp.src(sass_path)
                   .pipe(sassLint({
                        options:  {
                         formatter:  'stylish'}}))
                  .pipe(sassLint.format(file));
                  stream.on('finish',  function ()  {
                  file.end(); });
    console.log("Number of Errors : "+sassLint.length);
  console.log("Sass Linting Errors output on reports/sass-linting-errors/lint_sass.csv");
      return  stream;
});
//For linting css
gulp.task('lint-css', ['readconfig'], function lintCssTask() {
  return gulp.src(css_path)
    .pipe(gulpStylelint({
      reporters: [
        { formatter: 'string', console: true }
      ],
      config: { "extends": "stylelint-config-standard" }
    }));
});
//For parsing and checking whether css classes and id are prefixed with partnername
function checkcss(chunk) {
  util.log(util.colors.red("These classes should be prefixed with partnername : "));
  let test = chunk.match(/(^|}[\n\s]*)[\s]*(\.|#)[\s]*(?!partnername)[a-zA-Z1234567890_-]+((\s[a-zA-Z1234567890_-\s]+{)|[\s]*{)/gm).toString();//Change Partnername in the regex as required
  test = test.replace(/[},{\.\s]/g, ' ');
  util.log(util.colors.yellow(test));
}
gulp.task('check-css-classname', ['readconfig'], function () {
  var checkdepen = transform(function (filename) {
    return map(function (chunk, next) {
      return next(null, checkcss(chunk.toString()))
    })
  })
  gulp.src(sass_path)
    .pipe(checkdepen)
})
function checkcss2(chunk) {
  let test = chunk.match(/(\.|#)partnername\..+{/gm).toString();//Change Partnername in the regex as required
  test = test.replace(/[},{\.\s]/g, ' ');
  util.log(util.colors.yellow(test));
}
gulp.task('check-css-classname2', ['readconfig'], function () {
  var checkdepen = transform(function (filename) {
    return map(function (chunk, next) {
      return next(null, checkcss2(chunk.toString()))
    })
  })
  gulp.src(sass_path)
    .pipe(checkdepen)

})
//For testing whether accessibility standards are satisfied
gulp.task('test-accessibility', ['readconfig'], function () {
  return gulp.src([html_path, css_path])
    .pipe(access({
      force: true
    }))
    .on('error', console.log)
    .pipe(access.report({ reportType: 'csv' }))
    .pipe(rename({
      extname: '.csv'
    }))
    .pipe(gulp.dest('reports/test-accessibility-errors/'));
});
//To prevent overwriting of libraries and check for dependencies
gulp.task('checkdependency', ['readconfig'], function () {
  var checkdepen = transform(function (filename) {
    return map(function (chunk, next) {
      return next(null, checkangular(chunk.toString()))
    })
  })
  gulp.src(js_path)
    .pipe(checkdepen)
})
gulp.task('default', ['readconfig'], function () {
  runSequence(['lint', 'lint-css', 'sasslinting', 'checkdependency', 'test-accessibility'], 'check-css-classname', 'check-css-classname2')
});