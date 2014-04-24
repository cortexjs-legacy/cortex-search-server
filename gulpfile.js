var gulp = require('gulp');
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
var component = require('gulp-component');
var connect = require('gulp-connect');
var rename = require('gulp-rename');
var changed = require('gulp-changed');
var nib = require('nib');
process.on("uncaughtException",function(err){
    console.log(err,err.stack);
});

gulp.task('connect',function(){
    connect.server({
        port: 1234,
        livereload: true
    });
});


gulp.task('stylus', function(){
    var stylusOptions = {
        use: [nib()],
        import : ["nib"]
    };
    gulp.src(["./public/css/*.styl"])
        .pipe(changed('./public/css/', { extension: '.css' }))
        .pipe(stylus(stylusOptions))
        .pipe(gulp.dest('./public/css'))
        .pipe(connect.reload());
});

gulp.task('jade', function(){
    var source = gulp.src(["./public/jade/*.jade","!./public/jade/*layout.jade"])
        .pipe(changed('./public/html/', { extension: '.html' }))
        .pipe(jade())
        .pipe(gulp.dest("./public/html/"))
        .pipe(connect.reload());

    function change_name(source,name){
        source.pipe(rename({
            basename: name
        }))
        .pipe(gulp.dest("./public/html/"))
    }
});


gulp.task('watch', function () {
  gulp.watch(["./public/jade/**/*.jade"], ['jade']);
  gulp.watch(["./public/css/*.styl"], ['stylus']);
});

gulp.task('default', ['stylus','jade','watch','connect']);
