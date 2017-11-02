/* eslint-ignore */
'use strict';
/**
 * gulp example setup
 */
const path = require('path');
const gulp = require('gulp');
const gulpServerIo = require('../../index');
const root = path.join(__dirname, '..', 'fixtures', 'app');

gulp.task('serve', () => {
  return gulp.src(root)
    .pipe(
      gulpServerIo({
        path: root
      })
    );
});
