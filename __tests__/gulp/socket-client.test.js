'use strict';
/**
 * Testing the ioDebugger socket functions
 */
const request = require('supertest');
const File = require('vinyl');
const join = require('path').join;
const io = require('socket.io-client');
// Parameters
const webserver = require('../../index');
const {
  root,
  rootDir,
  baseUrl,
  defaultUrl,
  defaultPort,
  defaultOptions
} = require('../fixtures/config.js');
// Socket options
const defaultNamespace = defaultOptions.debugger.namespace;
const debuggerJs = [defaultOptions.debugger.namespace, defaultOptions.debugger.js].join('/');
// Start test with socket
describe('gulp-webserver-io debugger client test', () => {
  // Setups
  let stream;
  beforeEach( () => {
    stream = webserver({
      reload: false
    });
    stream.write(rootDir);
  });
  // Clean up afterward
  afterEach(() => {
    if (stream) {
      stream.emit('kill');
    }
  });
  // client test
  test.skip(`should able to read the ${debuggerJs}`, done => {
    return request(defaultUrl)
      .get(debuggerJs) // debuggerJs
      .expect(200, /gulpServerIo/);
  });

});
