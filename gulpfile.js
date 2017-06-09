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
var css_path = "/**/*.css", html_path = "/**/*.html", js_path = "/**/*.js", sass_path = "/**/*.s+(a|c)ss";
var jsonpath;
//Reads source paths from analyser_config.json
gulp.task('readconfig', function () {
  var pathcontent = fs.readFileSync("analyser_config.json");
  jsonpath = JSON.parse(pathcontent);
  css_path = jsonpath.cssRoot + "/**/*.css";
  html_path = jsonpath.htmlRoot + "/**/*.html";
  js_path = jsonpath.jsRoot + "/**/*.js";
  sass_path = jsonpath.sassRoot + "/**/*.s+(a|c)ss";
});
//For linting JavaScript files
gulp.task('lint', ['readconfig'], () => {
  if(jsonpath.eslinting_choice==="off")
  return print_eslint_errors_off();
  else if(jsonpath.eslinting_choice==="file")
  {
    return print_eslint_errors_file();
  }
  else if(jsonpath.eslinting_choice==="console")
  {
    return print_eslint_errors_console
  }
  else
  {
    return print_eslint_errors_incorrectselection();
  }
  function print_eslint_errors_file()
  {
      return gulp.src(js_path)
      .pipe(eslint())
      .pipe(eslint.result(result  =>  {
                // Called for each ESLint result. 
                console.log(util.colors.green(`ESLint result: ${result.filePath}`));
                console.log(util.colors.green(`# Messages: ${result.messages.length}`));
                console.log(util.colors.green(`# Warnings: ${result.warningCount}`));
                console.log(util.colors.green(`# Errors: ${result.errorCount}`));
                console.log("ESLinting Errors output on reports/eslint-errors/lintingerrors.csv");
         }))
      .pipe(eslint.formatEach('stylish', eslint_wstream));
  }
  function print_eslint_errors_console()
  {
    return gulp.src(js_path)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
  }
  function print_eslint_errors_off()
  {
    return;
  }
  function print_eslint_errors_incorrectselection()
  {
    console.log(util.colors.red("Configuration value for eslinting_choice not set correctly"));
    console.log(util.colors.red("Choose 'off', 'console', 'file'"));
    return;
  }
});
//For linting scss and sass
gulp.task('sasslinting', ['readconfig'], function () {
   var  file  =  fs.createWriteStream('reports/sass-linting-errors/lint_sass.csv');
   if(jsonpath.sasslinting_choice==="off")
   {
     return print_sasslint_errors_off();
   }
   else if(jsonpath.sasslinting_choice==="file")
   {
     return print_sasslint_errors_file();
   }
   else if(jsonpath.sasslinting_choice==="console")
   {
     return print_sasslint_errors_console();
   }
   else
   {
      return print_sasslint_errors_incorrectselection();
   }
   function print_sasslint_errors_off()
   {
      return;
   }

    function print_sasslint_errors_file()
   {
     var  stream  =  gulp.src(sass_path)
                     .pipe(sassLint({
                           options:  {
                           formatter:  'stylish'}}))
                    .pipe(sassLint.format(file));
                    stream.on('finish',  function ()  {
                    file.end(); });
      console.log(util.colors.green("SASSLINT"));
      console.log(util.colors.green("Number of Errors : "+sassLint.length));
      console.log(util.colors.green("Sass Linting Errors output on reports/sass-linting-errors/lint_sass.csv"));
      return  stream;
   }
    function print_sasslint_errors_console()
   {
     return gulp.src(sass_path)
    .pipe(sassLint())
    .pipe(sassLint.format())

    .pipe(sassLint.failOnError());
   }
   function print_sasslint_errors_incorrectselection()
  {
    console.log(util.colors.red("Configuration value for sasslinting_choice not set correctly"));
    console.log(util.colors.red("Choose 'off', 'console', 'file'"));
    return;
  }
});
//For linting css
gulp.task('lint-css', ['readconfig'], function lintCssTask() {
  if(jsonpath.csslinting_choice===0)
  {
    return gulp.src(css_path)
      .pipe(gulpStylelint({
        failAfterError: true,
        reportOutputDir: 'reports/csslinting_errors',
        reporters: [
         { formatter: 'string', save:'css_lint.csv' }
        ],
        config: { "extends": "stylelint-config-standard" }
      }));
  }
  else
  {
    return gulp.src(css_path)
    .pipe(gulpStylelint({
      reporters: [
        { formatter: 'string', console: true }
      ],
      config: { "extends": "stylelint-config-standard" }
    }));
  }
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
gulp.task('check-css-classname2', ['readconfig','check-css-classname'], function () {
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
  if(jsonpath.test_accessibility_choice===0)
  {
  return gulp.src([html_path, css_path])
    .pipe(access({
      force: true,
      verbose: false
    }))
   .on('error', console.log)
    .pipe(access.report({ reportType: 'csv' }))
    .pipe(rename({
      extname: '.csv'
    }))
    .pipe(gulp.dest('reports/test-accessibility-errors/'));
  }
  else
  {
    return gulp.src([html_path, css_path])
      .pipe(access({
        force: true
     }))
    .on('error', console.log);
  }
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
  runSequence(['lint', 'lint-css', 'sasslinting', 'checkdependency', 'test-accessibility', 'check-css-classname2'])
});