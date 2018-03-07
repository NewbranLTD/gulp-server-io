'use strict';
/**
 * Share all this options across different test
 */
const path = require('path');
const join = path.join;
const baseUrl = 'localhost';
const defaultPort = 8000;
const File = require('vinyl');
const defaultUrl = ['http://', baseUrl, ':', defaultPort].join('');
const defaultSSLUrl = ['https://', baseUrl, ':', defaultPort].join('');
const root = path.resolve( join(__dirname, 'app') );
const rootDir = new File({ path: join(__dirname, 'app') });
const directoryIndexMissingDir = new File({
  path: join(__dirname, 'directoryIndexMissing')
});
// grab the original options as well
const { defaultOptions } = require('../../src/lib/options');
// Export
module.exports = {
  root,
  rootDir,
  baseUrl,
  defaultUrl,
  defaultPort,
  defaultSSLUrl,
  directoryIndexMissingDir,
  defaultOptions
};
