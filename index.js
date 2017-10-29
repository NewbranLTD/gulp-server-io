/**
 * This will be come the main export file
 * When the consumer call it
 * const gulpServerIo = require('gulp-server-io')
 * When they want to use the underlying connect server
 * const server = require('gulp-server-io/server');
 * neat!
 */
const through = require('through2');
const server = require('./src/lib/express.js');
