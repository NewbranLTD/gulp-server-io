/**
 * Since we need to include the gulp for testing
 * might as well export this back so the developer
 * don't need to add add it to the dependecies
 */
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const streamWatcher = require('./src/lib/utils/stream-watcher');
// Re-export
exports.gulp = gulp;
exports.gulpUtil = gulpUtil;
exports.streamWatcher = streamWatcher;
