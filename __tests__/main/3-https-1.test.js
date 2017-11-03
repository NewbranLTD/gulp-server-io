'use strict';
const chalk = require('chalk');
const request = require('supertest');
const gutil = require('gulp-util');
const File = gutil.File;
const log = gutil.log;
const join = require('path').join;
const webserver = require('../../index');
const {
  root,
  rootDir,
  baseUrl,
  defaultUrl,
  defaultPort,
  defaultSSLUrl
} = require('../fixtures/config.js');
// Some configuration to enable https testing
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// Test start
describe('gulp-webserver-io stock test', () => {
  // Setups
  let stream;
  afterEach(() => {
    stream.emit('kill');
    stream = undefined;
  });
  // (5)
  test('(5) should work with https', () => {
    stream = webserver({
      https: true,
      debugger: false,
      reload: false
    });
    stream.write(rootDir);
    return request(defaultSSLUrl)
      .get('/')
      .expect(200, /Bootstrap Template test for gulp-server-io/);
  });
});
