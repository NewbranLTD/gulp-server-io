'use strict';
/**
 * Testing the middlewares
 */
const request = require('supertest');
const join = require('path').join;
// Parameters
const webserver = require('../../index');
const {
  root,
  rootDir,
  baseUrl,
  defaultUrl,
  defaultPort,
  defaultSSLUrl
} = require('../fixtures/config.js');
// Setups
let stream;

// Clean up afterward
afterEach(() => {
  if (stream) {
    stream.emit('kill');
    stream = undefined;
  }
});
// Util method
const shiftDownOne = str => str.substr(1, str.length - 1);
// Start the test
describe('gulp-webserver-io middleware test', () => {
  test('(1) should use middleware function', () => {
    const testPath = '/middleware';
    stream = webserver({
      reload: false,
      debugger: false,
      middleware: (req, res, next) => {
        if (req.url === testPath) {
          res.end(shiftDownOne(testPath));
        } else {
          next();
        }
      }
    });
    stream.write(rootDir);
    return request(defaultUrl)
      .get(testPath)
      .expect(200, 'middleware');
  });
});
