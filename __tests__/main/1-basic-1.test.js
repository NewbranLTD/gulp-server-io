'use strict';
const chalk = require('chalk');
const request = require('supertest');
const File = require('vinyl');
const log = require('fancy-log');
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
      debugger: false,
      reload: false
    });
    stream.write(rootDir);
    return request(defaultUrl)
      .get('/')
      .expect(200, /Bootstrap Template test for gulp-server-io/);
  });

});
