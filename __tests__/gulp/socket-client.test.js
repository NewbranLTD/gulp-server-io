'use strict';
/**
 * Testing the ioDebugger socket functions
 */
const request = require('supertest');
const File = require('gulp-util').File;
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
// Some configuration to enable https testing
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// Socket options
const defaultNamespace = defaultOptions.debugger.namespace;
const expectedMsg = defaultOptions.debugger.hello;
const debuggerJs = [defaultOptions.debugger.namespace, defaultOptions.debugger.js].join('/');
const options = {
  transports: ['websocket'],
  'force new connection': true
};
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
  test(`should able to read the ${debuggerJs}`, done => {
    return request(defaultUrl)
      .get(debuggerJs)
      .expect(200, /gulpServerIo/);
  });

});
