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
const gulpTs = require('gulp-typescript');

const genCopyTaskName = suffix => 'copy:' + suffix;
const genScriptTaskName = suffix => 'script:' + suffix;
const genTsTaskName = suffix => 'ts:' + suffix;
const genLessTaskName = suffix => 'less:' + suffix;

const buildTasks = builds
  .map(p => {
    const copyTask = genCopyTaskName(p.name);
    const scriptTask = genScriptTaskName(p.name);
    const tsTask = genTsTaskName(p.name);
    const lessTask = genLessTaskName(p.name);
    const pkgPath = path.resolve(__dirname, p.pkg);

    p.copySrc && gulp.task(copyTask, () => {
      return gulp.src(p.copySrc, p.option).pipe(gulp.dest(p.dest));
    });

    p.tsSrc && gulp.task(tsTask, () => {
      return gulp
        .src(p.tsSrc, p.option)
        .pipe(gulpTs.createProject('tsconfig.json')())
        .pipe(replace('__VERSION__', JSON.stringify(require(pkgPath).version)))
        .pipe(gulp.dest(p.dest));
    });

    p.scriptsSrc && gulp.task(scriptTask, () => {
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

    p.lessSrc && gulp.task(lessTask, () => {
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

    return [
      ...(p.copySrc ? [copyTask] : []),
      ...(p.scriptsSrc ? [scriptTask] : []),
      ...(p.tsSrc ? [tsTask] : []),
      ...(p.lessSrc ? [lessTask] : []),
    ];
  })
  .reduce((p, n) => p.concat(n), []);

gulp.task('build-watch', () => {
  builds.forEach(p => {
    const copyTask = genCopyTaskName(p.name);
    const scriptTask = genScriptTaskName(p.name);
    const tsTask = genTsTaskName(p.name);
    const lessTask = genLessTaskName(p.name);

    p.copySrc && gulp.watch(p.copySrc, gulp.series(copyTask));
    p.tsSrc && gulp.watch(p.tsSrc, gulp.series(tsTask));
    p.scriptsSrc && gulp.watch(p.scriptsSrc, gulp.series(scriptTask));
    p.lessSrc && gulp.watch(p.lessSrc, gulp.series(lessTask));
  });
});

const defaultTask = [gulp.parallel(buildTasks)];

if (process.env.NODE_ENV === 'development') {
  defaultTask.push('build-watch');
}

gulp.task('default', gulp.series(...defaultTask));
