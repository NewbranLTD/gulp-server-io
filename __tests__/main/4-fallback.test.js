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
  defaultSSLUrl,
  directoryIndexMissingDir
} = require('../fixtures/config.js');
// Test start
describe('gulp-webserver-io stock test', () => {
  // Setups
  let stream;
  afterEach(() => {
    stream.emit('kill');
    stream = undefined;
  });
  // (7)
  test('(7) should fallback to default.html', () => {
    stream = webserver({
      debugger: false,
      reload: false,
      fallback: 'default.html'
    });

    stream.write(rootDir);
    stream.end();

    return request(defaultUrl)
      .get('/some/random/path/')
      .expect(200, /Default/)
      .expect('Content-Type', /text\/html; charset=UTF-8/);
  });
  // (8)
  test('(8) should serve multiple sources even with a fallback', () => {
    stream = webserver({
      debugger: false,
      reload: false,
      fallback: 'default.html'
    });

    stream.write(rootDir);
    stream.write(directoryIndexMissingDir);
    stream.end();

    return request(defaultUrl)
      .get('/file.html')
      .expect(200, /file/);
  });
});
