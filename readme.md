# A static code analyzer tool.

To perform linting, deal with partner applications, prevent overwriting of styles, ensure certain naming convention for partners and ensure accessibility guidelines 

## GENERAL INSTALLATION GUIDELINES

This uses node.js so it should be installed 

Open the folder containing the project using terminal and type 
```shell
npm install
```
For MAC users type
```shell 
 sudo npm install
```
Then type 
```shell
gulp
```
If you want to run any specific method of the gulpfile.js type gulp followed by the name of the method


> ##  INSTRUCTION FOR PARTNERS:
> * Mention the path of your javascript, CSS, HTML, SASS files in analyser_config.json
>```json
>{
>   "jsRoot": "Sample/javascript",
>   "sassRoot":"Sample/sass",
>   "cssRoot":"Sample/css",
>   "htmlRoot":"Sample/html",
>```
> * In the analyser_config.json for the various type off checking
>
>       Type "off" to switch off the checking
>
>       Type "console" to display result in console
>
>       Type "file" to display result in a seperate file
>
>       checkdependency and check-css-classname will always be performed and result will be displayed in the console
>```json
>    "eslinting_choice":"file",
>    "sasslinting_choice":"file",
>    "csslinting_choice":"file",
>    "test_accessibility_choice":"file"
>```
> * In the gulpfile.js, in function checkcss()  replace the partner name in the regex expression which is by default given as partnername in invalidclasses and invalidclasses2.
```javascript
    function checkcss(chunk) {
  util.log(util.colors.green("Checking whether classes are prefixed by their partner names"));
  util.log(util.colors.red("These classes should be prefixed with partnername : "));
  let invalidclasses = chunk.match(/(^|}[\n\s]*)[\s]*(\.|#)[\s]*(?!partnername)[a-zA-Z1234567890_-]+((\s[a-zA-Z1234567890_-\s]+{)|[\s]*{)/gm).toString();//Change Partnername in the regex as required
  let invalidclasses2 = chunk.match(/(\.|#)partnername\..+{/gm).toString();//Change Partnername in the regex as required
  invalidclasses = invalidclasses.replace(/[},{\.\s]/g, ' ');
  invalidclasses2 = invalidclasses2.replace(/[},{\.\s]/g, ' ');
  util.log(util.colors.yellow(invalidclasses));
  util.log(util.colors.yellow(invalidclasses2));
}
```
> * In the Angulardependencies.js file mention the dependencies of your project in the fxp array.
> **In Angulardependency.js**
> ```javascript
> var moduleRegex = /\.module\(\s*("partnername"|'partnername')\s*,\s*(\[> [^\]]*\])/g;
> //Change Partnername here
> ```
> ## > INSTRUCTION FOR MAIN APPLICATION USER:
> * In the Angulardependencies.js file mention the dependencies of your  project in the fxp array.
> ```javascript
> var fxpmodule=["a","d"];// Main application must mention their > dependencies here
> ```
# **> PRODUCT DESCRIPTION**

## 1) It performs linting on the JavaScript files using ESLINT with some modified rules which is licensed under MIT. 

**CODE:**
In gulpfile.js
```javascript
gulp.task('lint', ['readconfig'], () => {
  if(jsonpath.eslinting_choice==="off")
  return print_eslint_errors_off();
  else if(jsonpath.eslinting_choice==="file")
  {
    return print_eslint_errors_file();
  }
  else if(jsonpath.eslinting_choice==="console")
  {
    return print_eslint_errors_console();
  }
  else
  {
    return print_eslint_errors_incorrectselection();
  }
  function print_eslint_errors_file()
  {
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
```

**HOW TO USE:** 
Use the required command
```shell
gulp lint
//For Mac Users
sudo gulp lint 
```
To modify or add some rules and plugins you can visit :http://eslint.org/

## 2)  Performs linting on the sass files using sassLint() using sass-lint which is licensed under MIT.

**CODE:**
In gulpfile.js
```javascript
//For linting scss and sass
gulp.task('sasslinting', ['readconfig'], function () {
   var  pathforsasslinting  =  fs.createWriteStream('reports/sass-linting-errors/lint_sass.csv');
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
                    .pipe(sassLint.format(pathforsasslinting));
                    stream.on('finish',  function ()  {
                    pathforsasslinting.end(); });
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
```

**HOW TO USE:** 
Use the required command
```shell
gulp sasslinting
//For Mac Users
sudo gulp sasslinting 
```
To modify or add some rules and plugins you can visit :http://eslint.org/

## 3)  Performs linting on the css files using lint-css() using stylelint  which is licensed under MIT.

**CODE:**
In gulpfile.js
```javascript
gulp.task('lint-css', ['readconfig'], function lintCssTask() {
  if(jsonpath.csslinting_choice==="off")
  {
      return print_csslint_errors_off();
  }
  else if(jsonpath.csslinting_choice==="file")
  {
    return print_csslint_errors_file();
  }
  else if(jsonpath.csslinting_choice==="console")
  {
    return print_csslint_errors_console();
  }
  else
  {
    return print_csslint_errors_incorrectselection();
  }


  function print_csslint_errors_off()
  {
    return;
  }
  function print_csslint_errors_file()
  {
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
  function print_csslint_errors_console()
  {
    return gulp.src(css_path)
    .pipe(gulpStylelint({
      reporters: [
        { formatter: 'string', console: true }
      ],
      config: { "extends": "stylelint-config-standard" }
    }));
  }
  function print_csslint_errors_incorrectselection()
  {
    console.log(util.colors.red("Configuration value for csslinting_choice not set correctly"));
    console.log(util.colors.red("Choose 'off', 'console', 'file'"));
    return;
  } 
});

```

**HOW TO USE:** 
Use the required command
```shell
gulp lint-css
//For Mac Users
sudo gulp lint-css
```
For modifying rules you can check :https://stylelint.io/user-guide/rules/

## 4) Ensures that all controllers, directives, filters, modules, services are prefixed by their partner names. 

**CODE:**
In .eslintrc.json
```json
        "angular/controller-name":[2,"partnername"],
        "angular/directive-name":[2,"partnername"],
        "angular/module-name":[2,"partnername"],
        "angular/service-name":[2,"partnername"],
        "angular/filter-name":[2,"partnername"]
        
```

**HOW TO USE:** 
Use the required command
```shell
gulp lint
//For Mac Users
sudo gulp lint 
```
For other such angular rules check : https://github.com/Gillespie59/eslint-plugin-angular#rules

## 5)  Ensures that the css files are prefixed by the partner names

**CODE:**
In gulpfile.js
```javascript
//For parsing and checking whether css classes and id are prefixed with partnername
function checkcss(chunk) {
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
      return next(null, checkcss(chunk.toString()))
    })
  })
  gulp.src(sass_path)
    .pipe(checkforclassprefix)
})
 
```

**HOW TO USE:**

Replace the partner name in the regex expression which is by default given as partnername in invalidclasses and invalidclasses2.

A)

```javascript
function checkcss(chunk) {
  util.log(util.colors.green("Checking whether classes are prefixed by their partner names"));
  util.log(util.colors.red("These classes should be prefixed with partnername : "));
  let invalidclasses = chunk.match(/(^|}[\n\s]*)[\s]*(\.|#)[\s]*(?!partnername)[a-zA-Z1234567890_-]+((\s[a-zA-Z1234567890_-\s]+{)|[\s]*{)/gm).toString();//Change Partnername in the regex as required
  let invalidclasses2 = chunk.match(/(\.|#)partnername\..+{/gm).toString();//Change Partnername in the regex as required
  invalidclasses = invalidclasses.replace(/[},{\.\s]/g, ' ');
  invalidclasses2 = invalidclasses2.replace(/[},{\.\s]/g, ' ');
  util.log(util.colors.yellow(invalidclasses));
  util.log(util.colors.yellow(invalidclasses2));
}
```

Use the required command
```shell
gulp check-css-classname
//For Mac Users
sudo gulp check-css-classname
```

## 6) Checks for any duplicate redundancies so that there are no chances of overwriting the versions of the dependencies

**CODE:**
In gulpfile.js
```javascript
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
```

**HOW TO USE:** 

 In the Angulardependencies.js file replace the partner name in the regex expression in moduleRegex which is by default given as partnername for the two instances.

[NOTE FOR MAIN APPLICATION USER]**

In the Angulardependencies.js file mention the dependencies of your project in the fxpModule array.
**In Angulardependency.js**
```javascript
var fs = require('fs');
var util = require('gulp-util');
var gutil = require('gulp-util');
var path = require('path');
var fxpModule = ["a", "d"];
var moduleRegex = /\.module\(\s*("partnername"|'partnername')\s*,\s*(\[[^\]]*\])/g;//Change Partnername here

```

Use the required command
```shell
gulp checkdependency
//For Mac Users
sudo gulp checkdependency
```

## 7) It checks whether the html and css files follow the accessibility guidelines

**CODE:**
In gulpfile.js
```javascript
gulp.task('test-accessibility', ['readconfig'], function () {
  if(jsonpath.test_accessibility_choice==="off")
  {
      return print_test_accessibility_off();
  }
  else if(jsonpath.test_accessibility_choice==='file')
  {
    return print_test_accessibility_file();
  }
  else if(jsonpath.test_accessibility_choice==='console')
  {
    return print_test_accessibility_console();
  }
  else
  {
    return print_test_accessibility_incorrectselection();
  }
  function print_test_accessibility_off()
  {
    return;
  }
  function print_test_accessibility_file()
  {
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
  function print_test_accessibility_console()
  {
    return gulp.src([html_path, css_path])
      .pipe(access({
        force: true
     }))
    .on('error', console.log);
  }
  function print_test_accessibility_incorrectselection()
  {
    console.log(util.colors.red("Configuration value for test_accessibility_choice not set correctly"));
    console.log(util.colors.red("Choose 'off', 'console', 'file'"));
    return;
  }
});
```

**HOW TO USE:** 
Use the required command
```shell
gulp test-accessibility
//For Mac Users
sudo gulp test-accessibility
```
## AUTHOR: Subhroneel Dey
## Mail : subhroneeldey4@gmail.com
## Available on Github : https://github.com/subhroneeldey/weblint/blob/master/readme.md

![myimage-alt-tag](./Subhroneel.jpg)