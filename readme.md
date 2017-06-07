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
> * In the gulpfile.js, in function checkcss() and checkcss2()., replace > the partner name in the regex expression which is by default given as > partnername.
> ```javascript
> function checkcss(chunk){
>     util.log(util.colors.red("These classes should be prefixed with > partnername : "));
>     let test = chunk.match(/(^|}[\n\s]*)[\s]*(\.|#)[\s]*(?!partnername)> [a-zA-Z1234567890_-]+((\s[a-zA-Z1234567890_-\s]+{)|[\s]*{)/gm)> .toString();//Change Partnername in the regex as required
> ```
> ```javascript
> function checkcss2(chunk){
>     let test = chunk.match(/(\.|#)partnername\..+{/gm).toString();> //Change Partnername in the regex as required
> ```
> * In the Angulardependencies.js file mention the dependencies of your > project in the fxp array.
> **In Angulardependency.js**
> ```javascript
> var moduleRegex = /\.module\(\s*("partnername"|'partnername')\s*,\s*(\[> [^\]]*\])/g;
> //Change Partnername here
> ```
> ## > INSTRUCTION FOR MAIN APPLICATION USER:
> * In the Angulardependencies.js file mention the dependencies of your > project in the fxp array.
> ```javascript
> var fxparray=["a","d"];// Main application must mention their > dependencies here
> ```
# **> PRODUCT DESCRIPTION**

## 1) It performs linting on the JavaScript files using ESLINT with some modified rules which is licensed under MIT. 

**CODE:**
In gulpfile.js
```javascript
gulp.task('lint', () => {
    return gulp.src('javascript/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
```

**HOW TO USE:** 
Use the required command
```shell
gulp lint
//For Mac Users
sudo gulp lint 
```
## 2)  Performs linting on the sass files using sassLint() using sass-lint which is licensed under MIT.

**CODE:**
In gulpfile.js
```javascript
gulp.task('sasslinting', function () {
  return gulp.src('sass/**/*.s+(a|c)ss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    
    .pipe(sassLint.failOnError())
});
```

**HOW TO USE:** 
Use the required command
```shell
gulp sasslinting
//For Mac Users
sudo gulp sasslinting 
```

## 3) Ensures that all controllers, directives, filters, modules, services are prefixed by their partner names. 

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

## 4)  Ensures that the css files are prefixed by the partner names

**CODE:**
In gulpfile.js
```javascript

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
```

**HOW TO USE:**

Replace the partner name in the regex expression which is by default given as partnername in both function checkcss() and checkcss2().

A)

```javascript
function checkcss(chunk){
    util.log(util.colors.red("These classes should be prefixed with partnername : "));
    let test = chunk.match(/(^|}[\n\s]*)[\s]*(\.|#)[\s]*(?!partnername)[a-zA-Z1234567890_-]+((\s[a-zA-Z1234567890_-\s]+{)|[\s]*{)/gm).toString();//Change Partnername in the regex as required
```
B)

```javascript
function checkcss2(chunk){
    let test = chunk.match(/(\.|#)partnername\..+{/gm).toString();//Change Partnername in the regex as required
```

Use the required command
```shell
gulp check-css-classname
gulp check-css-classname2
//For Mac Users
sudo gulp check-css-classname
sudo gulp check-css-classname2
```

## 5) Checks for any duplicate redundancies so that there are no chances of overwriting the versions of the dependencies

**CODE:**
In gulpfile.js
```javascript
gulp.task('checkdependency', function() {
  var checkdepen = transform(function(filename) {
    return map(function(chunk, next) {
      return next(null, checkangular(chunk.toString()))
    })
  })
  gulp.src('javascript/*.js')
    .pipe(checkdepen)    
})
```

**HOW TO USE:** 

 In the Angulardependencies.js file replace the partner name in the regex expression which is by default given as partnername for the two instances.

[NOTE FOR MAIN APPLICATION USER]**

In the Angulardependencies.js file mention the dependencies of your project in the fxp array.
**In Angulardependency.js**
```javascript
var fs=require('fs')
var gutil = require('gulp-util');
var path = require('path');
var fxparray=["a","d"];// Main application must mention their dependencies here
var moduleRegex = /\.module\(\s*("partnername"|'partnername')\s*,\s*(\[[^\]]*\])/g;
//Change Partnername here

```

Use the required command
```shell
gulp checkdependency
//For Mac Users
sudo gulp checkdependency
```

## 6) It checks whether the html and css files follow the accessibility guidelines and reports necessary errors in a separate file

**CODE:**
In gulpfile.js
```javascript
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