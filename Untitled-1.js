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



gulp.task('changehtml', function() {
  var change_html = transform(function(filename) {
    return map(function(chunk, next) {
      return next(null, "<div class="+partnername+">\n"+chunk.toString()+"\n</div>")
    })
  })
  gulp.src('html/*.html')
    .pipe(change_html)
    .pipe(gulp.dest('html/'))
})

//For modifying sass class name for partners
gulp.task('changesass', function() {
  var change = transform(function(filename) {
    return map(function(chunk, next) {
      return next(null, "."+partnername+"{\n"+chunk.toString()+"}")
    })
  })
  gulp.src('sass/**/*.s+(a|c)ss')
    .pipe(change)
    .pipe(gulp.dest('sass/'))
})


gulp.task('changecss', function() {
  var changes = transform(function(filename) {
    return map(function(chunk, next) {
      return next(null, "."+partnername+"{\n"+chunk.toString()+"}")
    })
  })
  gulp.src('css/**/*.css')
    .pipe(changes)
    .pipe(sass())
    .pipe(gulp.dest('dist/css/'))
})
//Add Class Name Before css
gulp.task('html_pre', function () {
  return gulp.src(['html/*.html'])
    .pipe(html_pre())
    .pipe(gulp.dest('html'));
});


