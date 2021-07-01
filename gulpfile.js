const path = require('path');
const gulp = require('gulp');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const builds = require('./scripts/config');

const genCopyTaskName = suffix => 'copy:' + suffix;
const genScriptTaskName = suffix => 'script:' + suffix;
const genLessTaskName = suffix => 'less:' + suffix;

const buildTasks = builds
  .map(p => {
    const copyTask = genCopyTaskName(p.name);
    const scriptTask = genScriptTaskName(p.name);
    const lessTask = genLessTaskName(p.name);
    const pkgPath = path.resolve(__dirname, p.pkg);

    gulp.task(copyTask, () => {
      return gulp.src(p.copySrc, p.option).pipe(gulp.dest(p.dest));
    });

    gulp.task(scriptTask, () => {
      return gulp
        .src(p.scriptsSrc, p.option)
        .pipe(replace('__VERSION__', JSON.stringify(require(pkgPath).version)))
        .pipe(
          babel({
            plugins: ['@babel/plugin-transform-modules-commonjs']
          })
        )
        .pipe(uglify())
        .pipe(gulp.dest(p.dest));
    });

    gulp.task(lessTask, () => {
      return gulp
        .src(p.lessSrc, p.option)
        .pipe(
          less().on('error', function (e) {
            console.error(e.message);
            this.emit('end');
          })
        )
        .pipe(postcss([autoprefixer]))
        .pipe(
          rename(function (path) {
            path.extname = '.wxss';
          })
        )
        .pipe(gulp.dest(p.dest));
    });

    return [copyTask, scriptTask, lessTask];
  })
  .reduce((p, n) => p.concat(n), []);

gulp.task('build-watch', () => {
  builds.forEach(p => {
    const copyTask = genCopyTaskName(p.name);
    const scriptTask = genScriptTaskName(p.name);
    const lessTask = genLessTaskName(p.name);

    gulp.watch(p.copySrc, gulp.series(copyTask));
    gulp.watch(p.scriptsSrc, gulp.series(scriptTask));
    gulp.watch(p.lessSrc, gulp.series(lessTask));
  });
});

const defaultTask = [gulp.parallel(buildTasks)];

if (process.env.NODE_ENV === 'development') {
  defaultTask.push('build-watch');
}

gulp.task('default', gulp.series(...defaultTask));
