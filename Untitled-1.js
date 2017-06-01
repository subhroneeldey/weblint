let app = angular.module("myModuleName",[]);

app.controller("grmMycontroller", []);
app.directive("grmMycontroller", []);
app.service("grmMycontroller", []);


.module();
.controller();
.service();
.directive();
.filter()


"grmDropdown"








//Add Class Name Before html Done for class id left Double Quotes must be enforced 
gulp.task('prefixhtml', function(){
  gulp.src(['html/*.html'])
    .pipe(prefixhtml(/class[\s]*=[\s]*(')/ ,classname_singlequote))//For class name defined with single quote
    .pipe(gulp.dest('html'));
gulp.src(['html/*.html'])
    .pipe(prefixhtml(/class[\s]*=[\s]*(")/ ,classname_doublequote))//For class name defined with double quote
    .pipe(gulp.dest('html'));
gulp.src(['html/*.html'])
    .pipe(prefixhtml(/id[\s]*=[\s]*(')/ ,idname_singlequote))//For id name defined with single quote
    .pipe(gulp.dest('html'));
gulp.src(['html/*.html'])
    .pipe(prefixhtml(/id[\s]*=[\s]*(')/ ,idname_doublequote))//For id name defined with double quote
    .pipe(gulp.dest('html'));
});


