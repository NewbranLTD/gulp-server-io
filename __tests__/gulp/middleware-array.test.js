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
// Util method
const shiftDownOne = str => str.substr(1, str.length - 1);
// Start the test
describe('gulp-webserver-io middleware test', () => {
  // Setups
  let stream;
  // Clean up afterward
  afterEach(() => {
    if (stream) {
      stream.emit('kill');
      stream = undefined;
    }
  });
  // There is a bug with supertest?
  // https://github.com/visionmedia/supertest/issues/430
  test('(2) , should use middleware array', done => {
    const testPaths = ['/middleware1', '/middleware2'];
    stream = webserver({
      reload: false,
      debugger: false,
      middleware: [
        function(req, res, next) {
          if (req.url === testPaths[0]) {
            res.end(shiftDownOne(testPaths[0]));
          } else {
            next();
          }
        },
        function(req, res, next) {
          if (req.url === testPaths[1]) {
            res.end(shiftDownOne(testPaths[1]));
          } else {
            next();
          }
        }
      ]
    });
    stream.write(rootDir);

    return request(defaultUrl)
      .get(testPaths[1])
      .expect(200, shiftDownOne(testPaths[1]))
      .end( done );
  });
});
