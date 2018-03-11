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
// Some configuration to enable https testing

// Test start
describe('gulp-webserver-io stock test', () => {
  // Setups
  let stream;
  afterEach(() => {
    stream.emit('kill');
    stream = undefined;
  });
  // (6)
  test('(6) should work with https and custom certificate', () => {
    stream = webserver({
      debugger: false,
      reload: false,
      https: {
        enable: true,
        key: join(__dirname, '..', '..', 'src', 'certs', 'cert.pem'),
        cert: join(__dirname, '..', '..', 'src', 'certs', 'cert.crt')
      }
    });
    stream.write(rootDir);
    return request(defaultSSLUrl)
      .get('/')
      .expect(200, /Bootstrap Template test for gulp-server-io/);
  });
});
