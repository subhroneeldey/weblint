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
var css_path = "/**/*.css", html_path = "/**/*.html", js_path = "/**/*.js", sass_path = "/**/*.s+(a|c)ss";
//Reads source paths from analyser_config.json
gulp.task('readconfig', function () {
  var pathcontent = fs.readFileSync("analyser_config.json");
  var jsonpath = JSON.parse(pathcontent);
  css_path = jsonpath.cssRoot + css_path;
  html_path = jsonpath.htmlRoot + html_path;
  js_path = jsonpath.jsRoot + js_path;
  sass_path = jsonpath.sassRoot + sass_path;

});
//For linting JavaScript files
gulp.task('lint', () => {
  return gulp.src(js_path)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
//For linting scss and sass
gulp.task('sasslinting', function () {
  return gulp.src(sass_path)
    .pipe(sassLint())
    .pipe(sassLint.format())

    .pipe(sassLint.failOnError())
});
//For linting css
gulp.task('lint-css', function lintCssTask() {
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
gulp.task('check-css-classname', function () {
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
gulp.task('check-css-classname2', function () {
  var checkdepen = transform(function (filename) {
    return map(function (chunk, next) {
      return next(null, checkcss2(chunk.toString()))
    })
  })
  gulp.src(sass_path)
    .pipe(checkdepen)

})
//For testing whether accessibility standards are satisfied
gulp.task('test-accessibility', function () {
  return gulp.src([html_path, css_path])
    .pipe(access({
      force: true
    }))
    .on('error', console.log)
    .pipe(access.report({ reportType: 'txt' }))
    .pipe(rename({
      extname: '.txt'
    }))
    .pipe(gulp.dest('reports/txt'));
});
//To prevent overwriting of libraries and check for dependencies
gulp.task('checkdependency', function () {
  var checkdepen = transform(function (filename) {
    return map(function (chunk, next) {
      return next(null, checkangular(chunk.toString()))
    })
  })
  gulp.src(js_path)
    .pipe(checkdepen)
})
gulp.task('default', ['readconfig'], function () {
  runSequence(['lint', 'lint-css', 'sasslinting', 'checkdependency'], 'check-css-classname', 'check-css-classname2', 'test-accessibility')
});