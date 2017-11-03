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
  // (3)
  test('(3) should work with custom host', () => {
    const test3host = '127.0.0.1';
    stream = webserver({
      host: test3host,
      debugger: false,
      reload: false
    });
    stream.write(rootDir);

    return request(['http://', test3host, ':', defaultPort].join(''))
      .get('/')
      .expect(200, /Bootstrap Template test for gulp-server-io/);
  });
  // (4)
  test('(4) should work with custom path', () => {
    const test4path = '/custom';
    stream = webserver({
      path: test4path,
      debugger: false,
      reload: false
    });
    stream.write(rootDir);
    return request([defaultUrl, test4path].join(''))
      .get('/')
      .expect(200, /Bootstrap Template test for gulp-server-io/);
  });
});
