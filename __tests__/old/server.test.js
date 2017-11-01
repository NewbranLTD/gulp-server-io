'use strict';
/**
 * This is going to test the standalone server setup
 */
const chalk = require('chalk');
const request = require('supertest');
const gutil = require('gulp-util');
const File = gutil.File;
const log = gutil.log;
const join = require('path').join;
const webserver = require('../server');
const {
  root,
  baseUrl,
  defaultPort,
  defaultUrl,
  defaultSSLUrl
} = require('./fixtures/config');
// Some configuration to enable https testing
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('Standlone server test', () => {
  let server;

  afterEach(() => {
    server.close();
  });

  test('(1) should work with default options', () => {
    server = webserver({
      path: root
    });
  });
});
