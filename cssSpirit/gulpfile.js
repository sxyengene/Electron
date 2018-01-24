var lessFiles = ['./less/*.less','!**/workbenchbase.less'];
var cssFiles = './css/';

var gulp = require('gulp');
const less = require('gulp-less');

gulp.task('doless', function() {
  gulp.src(lessFiles)
  	.pipe(less())
  	.pipe(gulp.dest(cssFiles))
});

gulp.task('watch',() => {
    gulp.watch(lessFiles, ['doless']);
});

gulp.task('default',['doless','watch']);