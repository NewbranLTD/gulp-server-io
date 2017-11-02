'use strict';
const chalk = require('chalk');
const request = require('supertest');
const gutil = require('gulp-util');
const File = gutil.File;
const log = gutil.log;
const join = require('path').join;
const webserver = require('../../../index');
const {
  root,
  baseUrl,
  defaultPort,
  defaultUrl,
  defaultSSLUrl
} = require('../../fixtures/config.js');
// Some configuration to enable https testing
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const rootDir = new File({ path: join(__dirname, '..', '..', 'fixtures') });
// Test start
describe('gulp-server-io default test', () => {
  // Setups
  let stream;
  afterEach(() => {
    stream.emit('kill');
    stream = undefined;
  });
  // (1) test with basic options
  test('(1) should work with default options', () => {
    stream = webserver({
      path: root,
      debugger: false,
      reload: false
    });
    stream.write(rootDir);
    return request(defaultUrl)
      .get('/')
      .expect(200, /Bootstrap Template test for gulp-server-io/);
  });
  // (2) test with custom port number
  test('(2) should work with custom port', () => {
    const test2port = 1111;
    stream = webserver({
      port: test2port,
      path: root,
      debugger: false,
      reload: false
    });
    stream.write(rootDir);
    return request(['http://', baseUrl, ':', test2port].join(''))
      .get('/')
      .expect(200, /Bootstrap Template test for gulp-server-io/);
  });
});
