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
const expectedMsg = defaultOptions.debugger.hello;
const debuggerJs = [defaultOptions.debugger.namespace, defaultOptions.debugger.js].join('/');
const options = {
  transports: ['websocket'],
  'force new connection': true
};
// Start test with socket
describe('gulp-webserver-io debugger server test', () => {
  // Setups
  let stream;
  let client;
  // Clean up afterward
  afterEach(() => {
    if (stream) {
      stream.emit('kill');
      stream = undefined;
    }
    client = undefined;
  });
  // server test
  test(`should auto start debugger-io and connect to default namespace ${defaultNamespace}`, done => {
    stream = webserver({
      reload: false
    });
    stream.write(rootDir);

    client = io.connect([defaultUrl, defaultNamespace].join(''), options);
    client.on('connect', () => {
      expect(true).toBeTruthy(); // Just throw one at it
    });
    client.on('hello', msg => {
      expect(msg).toBe(expectedMsg);
      done();
    });
  });
});
