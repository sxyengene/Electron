var lessFiles = ['./less/*.less','!**/workbenchbase*'];
var cssFiles = './css/';

var gulp = require('gulp');
const less = require('gulp-less');

gulp.task('doless', function() {
  gulp.src(lessFiles)
  	.pipe(less())
  	.pipe(gulp.dest(cssFiles))
});

gulp.task('default',['doless'], () => {
    return gulp.watch(lessFiles, ['doless']);
});