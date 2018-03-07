/**
 * Top level export method
 * @TODO export a gulp version with the gulp-inject
 * otherwise just export the method
 */
const gulpServerIo = require('./src');
const {
  defaultOptions,
  defaultProperties,
  enableMiddlewareShorthand
} = require('./src/lib/options');
// Main
module.exports = function(options = {}) {
  const config = enableMiddlewareShorthand(defaultOptions, options, defaultProperties);
  config.__processed__ = true;
  // Console.log('Top config', config);
  /**
   * @TODO For injection with gulp-inject
   * I think we need to create this here
   */
  /*
  if (options.inject !== undefined &&
      options.inject.target !== undefined &&
      options.inject.source !== undefined) {
    const gulp = require('gulp');
    const inject = require('gulp-inject');
    // create the gulp functional stack
    return gulp.series(

    )
  }
  */
  return gulpServerIo(config);
};
