var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var uglify = require('gulp-uglify-es').default;

var sass = require('gulp-sass');
sass.compiler = require('node-sass');

gulp.task('sass', function () {
  return gulp.src('./src/css/dropkiq.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series(gulp.parallel('sass'), function () {
    return tsProject.src()
        .pipe(tsProject())
        .js
        .pipe(uglify(/* options */))
        .pipe(gulp.dest('dist'));
}));
