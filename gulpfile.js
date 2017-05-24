const gulp = require('gulp');
const eslint = require('gulp-eslint');
const sassLint = require('gulp-sass-lint');
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





gulp.task('default', ['lint','sass'], function () {
    
});