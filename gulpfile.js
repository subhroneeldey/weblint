const gulp = require('gulp');
const eslint = require('gulp-eslint');
const sassLint = require('gulp-sass-lint');
var check = require('gulp-check');//To check for regular expression for multiple class names
var util = require('gulp-util');
var classPrefix =require('gulp-class-prefix');
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






//Add Class Name Before
gulp.task('prefix', function() {
  return gulp.src('css/index.css')
    .pipe(classPrefix('partnerName-'))
    .pipe(gulp.dest('css/index.css'));
});




gulp.task('default', ['lint','sass','check'], function () {
    
});