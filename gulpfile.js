var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var uglify = require('gulp-uglify-es').default;

const browserify = require('browserify');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

var importCss = require('gulp-import-css');
var sass = require('gulp-sass');
sass.compiler = require('node-sass');

gulp.task('sass', function () {
  return gulp.src('./src/css/dropkiq.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(importCss())
    .pipe(gulp.dest('dist'));
});

gulp.task('js', function() {
  return browserify({
      basedir: '.',
      debug: true,
      entries: ['src/index.ts'],
      cache: {},
      packageCache: {}
  })
  .plugin(tsify, { noImplicitAny: true })
  .bundle().on('error', (e) => console.log(e))
  .pipe(source('dropkiq.min.js'))
  .pipe(buffer())
  .pipe(uglify(/* options */))
  .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series(gulp.parallel('sass'), gulp.parallel('js'), function () {
  return tsProject.src()
      .pipe(tsProject())
      .js
      .pipe(uglify(/* options */))
      .pipe(gulp.dest('dist'));
}));