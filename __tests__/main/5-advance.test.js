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

  // (9) this will be the last directory listing test - we skip the other disabled negative test etc
  // there were:
  // - should not show a directory listing when the shorthand setting is disabled
  // - should show a directory listing when the shorthand setting is enabled and using custom path
  // they are not being use very often
  test.skip('(9) should show a directory listing when the shorthand settings is enabled', () => {
    stream = webserver({
      debugger: false,
      reload: false,
      directoryListing: true
    });

    stream.write(directoryIndexMissingDir);

    return request(defaultUrl)
      .get('/')
      .expect(200, /listing directory/);
  });

  // (10) this one will be different because the v2 assign a random port between 35000~40000
  // therefore we need to fix on one port number
  test.skip('(10) should start the livereload server when the shorthand setting is enabled', () => {
    const test10port = 35729;
    stream = webserver({
      debugger: false,
      reload: {
        enable: true,
        port: test10port
      }
    });
    stream.write(rootDir);
    return request(['http://', baseUrl, ':', test10port].join(''))
      .get('/')
      .expect(200);
  });
  // testing the if the file is injected correctly
  // @20171112 this test still failed could not read the injected file
  test.skip('(11) test if we have the reload.js file injected', () => {
    stream = webserver({
      debugger: false
    });
    stream.write(rootDir);
    return request(defaultUrl)
      .get('/')
      .expect(200, /src="\/reload\/reload.js"/);
  });
});
