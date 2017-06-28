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
var fs = require('fs-extra');
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
  return printEslintErrorsOff();
  else if(jsonpath.eslinting_choice==="file")
  {
    return printEslintErrorsFile();
  }
  else if(jsonpath.eslinting_choice==="console")
  {
    return printEslintErrorsConsole();
  }
  else
  {
    return printEslintErrorsIncorrectSelection();
  }
  function printEslintErrorsFile()
  {
    const eslintdir = 'reports/eslint-errors/lintingerrors.csv';
    fs.ensureFileSync(eslintdir, err => {});
      var eslint_writetofile = fs.createWriteStream('reports/eslint-errors/lintingerrors.csv');
      return gulp.src(js_path)
      .pipe(eslint())
      .pipe(eslint.result(result  =>  {
                console.log(util.colors.green(`ESLint result: ${result.filePath}`));
                console.log(util.colors.green(`# Messages: ${result.messages.length}`));
                console.log(util.colors.green(`# Warnings: ${result.warningCount}`));
                console.log(util.colors.green(`# Errors: ${result.errorCount}`));
                console.log(util.colors.green("ESLinting Errors output on reports/eslint-errors/lintingerrors.csv"));
         }))
      .pipe(eslint.format('stylish', eslint_writetofile));
  }
  function printEslintErrorsConsole()
  {
    return gulp.src(js_path)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
  }
  function printEslintErrorsOff()
  {
    return;
  }
  function printEslintErrorsIncorrectSelection()
  {
    console.log(util.colors.red("Configuration value for eslinting_choice not set correctly"));
    console.log(util.colors.red("Choose 'off', 'console', 'file'"));
    return;
  }
});
//For linting scss and sass
gulp.task('sasslinting', ['readconfig'], function () {
   var  pathforsasslinting  =  fs.createWriteStream('reports/sass-linting-errors/lint_sass.csv');
   if(jsonpath.sasslinting_choice==="off")
   {
     return printSasslintErrorsOff();
   }
   else if(jsonpath.sasslinting_choice==="file")
   {
     return printSasslintErrorsFile();
   }
   else if(jsonpath.sasslinting_choice==="console")
   {
     return printSasslintErrorsConsole();
   }
   else
   {
      return printSasslintErrorsIncorrectSelection();
   }
   function printSasslintErrorsOff()
   {
      return;
   }

    function printSasslintErrorsFile()
   {
     const sasslintdir='reports/sass-linting-errors/lint_sass.csv';
     fs.ensureFileSync(sasslintdir, err => {});
     var  stream  =  gulp.src(sass_path)
                     .pipe(sassLint({
                           options:  {
                           formatter:  'stylish'}}))
                    .pipe(sassLint.format(pathforsasslinting));
                    stream.on('finish',  function ()  {
                    pathforsasslinting.end(); });
      console.log(util.colors.green("SASSLINT"));
      console.log(util.colors.green("Number of Errors : "+sassLint.length));
      console.log(util.colors.green("Sass Linting Errors output on reports/sass-linting-errors/lint_sass.csv"));
      return  stream;
   }
    function printSasslintErrorsConsole()
   {
     return gulp.src(sass_path)
    .pipe(sassLint())
    .pipe(sassLint.format())

    .pipe(sassLint.failOnError());
   }
   function printSasslintErrorsIncorrectSelection()
  {
    console.log(util.colors.red("Configuration value for sasslinting_choice not set correctly"));
    console.log(util.colors.red("Choose 'off', 'console', 'file'"));
    return;
  }
});
//For linting css
gulp.task('lint-css', ['readconfig'], function lintCssTask() {
  if(jsonpath.csslinting_choice==="off")
  {
      return printCsslintErrorsOff();
  }
  else if(jsonpath.csslinting_choice==="file")
  {
    return printCsslintErrorsFile();
  }
  else if(jsonpath.csslinting_choice==="console")
  {
    return printCsslintErrorsConsole();
  }
  else
  {
    return printCsslintErrorsIncorrectSelection();
  }


  function printCsslintErrorsOff()
  {
    return;
  }
  function printCsslintErrorsFile()
  {
    const csslintdir='reports/csslinting_errors/css_lint.csv';
    fs.ensureFileSync(csslintdir, err => {});
    console.log(util.colors.green("CSSLINT"));
    console.log(util.colors.green("CSS Linting Errors output on reports/csslinting_errors/css_lint.csv"));
    return gulp.src(css_path)
      .pipe(gulpStylelint({
        failAfterError: false,
        reportOutputDir: 'reports/csslinting_errors',
        reporters: [
         { formatter: 'string', save:'css_lint.csv' }
        ],
        config: { "extends": "stylelint-config-standard" }
      }));
  }
  function printCsslintErrorsConsole()
  {
    return gulp.src(css_path)
    .pipe(gulpStylelint({
      reporters: [
        { formatter: 'string', console: true }
      ],
      config: { "extends": "stylelint-config-standard" }
    }));
  }
  function printCsslintErrorsIncorrectSelection()
  {
    console.log(util.colors.red("Configuration value for csslinting_choice not set correctly"));
    console.log(util.colors.red("Choose 'off', 'console', 'file'"));
    return;
  } 
});
//For parsing and checking whether css classes and id are prefixed with partnername
function checkCss(chunk) {
  util.log(util.colors.green("Checking whether classes are prefixed by their partner names"));
  util.log(util.colors.red("These classes should be prefixed with partnername : "));
  let invalidclasses = chunk.match(/(^|}[\n\s]*)[\s]*(\.|#)[\s]*(?!partnername)[a-zA-Z1234567890_-]+((\s[a-zA-Z1234567890_-\s]+{)|[\s]*{)/gm).toString();//Change Partnername in the regex as required
  let invalidclasses2 = chunk.match(/(\.|#)partnername\..+{/gm).toString();//Change Partnername in the regex as required
  invalidclasses = invalidclasses.replace(/[},{\.\s]/g, ' ');
  invalidclasses2 = invalidclasses2.replace(/[},{\.\s]/g, ' ');
  util.log(util.colors.yellow(invalidclasses));
  util.log(util.colors.yellow(invalidclasses2));
}
gulp.task('check-css-classname', ['readconfig'], function () {
  var checkforclassprefix = transform(function (filename) {
    return map(function (chunk, next) {
      return next(null, checkCss(chunk.toString()))
    })
  })
  gulp.src(sass_path)
    .pipe(checkforclassprefix)
})
//For testing whether accessibility standards are satisfied
gulp.task('test-accessibility', ['readconfig'], function () {
  if(jsonpath.test_accessibility_choice==="off")
  {
      return printTestAccessibilityOff();
  }
  else if(jsonpath.test_accessibility_choice==='file')
  {
    return printTestAccessibilityFile();
  }
  else if(jsonpath.test_accessibility_choice==='console')
  {
    return printTestAccessibilityConsole();
  }
  else
  {
    return printTestAccessibilityIncorrectSelection();
  }
  function printTestAccessibilityOff()
  {
    return;
  }
  function printTestAccessibilityFile()
  {
    const accessibilitydir='reports/test-accessibility-errors'
    fs.ensureDirSync(accessibilitydir, err => {});
    console.log(util.colors.green("Testing Accessibility Requirements"));
    console.log(util.colors.green("Accessibilty Errors output on reports/test-accessibility-errors/"));
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
  function printTestAccessibilityConsole()
  {
    return gulp.src([html_path, css_path])
      .pipe(access({
        force: true
     }))
    .on('error', console.log);
  }
  function printTestAccessibilityIncorrectSelection()
  {
    console.log(util.colors.red("Configuration value for test_accessibility_choice not set correctly"));
    console.log(util.colors.red("Choose 'off', 'console', 'file'"));
    return;
  }
});
//To prevent overwriting of libraries and check for dependencies
gulp.task('checkdependency', ['readconfig'], function () {
  console.log(util.colors.yellow("Checking For Duplicate Dependencies"));
  var checkdepen = transform(function (filename) {
    return map(function (chunk, next) {
      return next(null, checkangular(chunk.toString()))
    })
  })
  gulp.src(js_path)
    .pipe(checkdepen)
})
gulp.task('default',['lint',  'sasslinting', 'checkdependency', 'test-accessibility', 'check-css-classname','lint-css'],  function () {
  
});