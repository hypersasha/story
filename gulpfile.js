let gulp = require('gulp');
let less = require('gulp-less');

gulp.task('css', () => {
    return gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('www/styles'))
});

gulp.task('watch', () => {
    gulp.watch('src/less/*.less', ['css'])
});

gulp.task('default', ['watch']);