/* eslint-ignore */
'use strict';
/**
 * gulp example setup
 */
const path = require('path');
const gulp = require('gulp');
const gulpServerIo = require('../../index');
const root = [
  path.join(__dirname, '..', 'fixtures', 'app'),
  path.join(__dirname, '..', 'fixtures', 'rootDir')
];

const config1 = {
  port: 3456
}; // add stuff here

gulp.task('serve', () => {
  return gulp.src(root)
    .pipe(
      gulpServerIo(config1)
    );
});

  //////////////////////////////
  //      TEST INJECTION      //
  //////////////////////////////

const config2 = {
  
};


// testing the wiredep
gulp.task('wire', () => {
  return gulp.src(root)
    .pipe(
      gulpServerIo(config2)
    )
})
