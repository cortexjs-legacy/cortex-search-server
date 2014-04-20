var gulp = require('gulp');
var stylus = require('gulp-stylus');
var path = require('path');
var nib = require('nib');


gulp.task('stylus', function() {
    gulp.src('./stylus/**/*.styl')
        .pipe(stylus({
            use: [nib()],
            import: ["nib"]
        }))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', function() {
    gulp.watch("./stylus/*", ['stylus']);
});

gulp.task('default', ['stylus']);