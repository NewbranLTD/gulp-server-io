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
  defaultSSLUrl
} = require('../fixtures/config.js');
// Some configuration to enable https testing
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// Setups
let stream;
let client;

// Clean up afterward
afterEach(() => {
  if (stream) {
    stream.emit('kill');
    stream = undefined;
  }
  if (client) {
    // There is no need to close client because the server get kill anyway
    client = undefined;
  }
});
// Socket options
const namespace = '/iodebugger';
const customNamespace = '/my-custom-namespace';
const expectedMsg = 'IO DEBUGGER is listening ...';
const options = {
  transports: ['websocket'],
  'force new connection': true
};
// Start test with socket
describe('gulp-webserver-io ioDebugger test', () => {
  test.skip(`(1) should auto start io-debugger and able to connect default namespace ${namespace}`, done => {
    stream = webserver({
      open: false
    });
    stream.write(rootDir);

    client = io.connect([defaultUrl, namespace].join(''), options);
    client.on('connect', () => {
      expect(true).toBeTruthy(); // Just throw one at it
    });
    client.on('hello', msg => {
      expect(msg).toBe(expectedMsg);
      done();
    });
  });

  test(`(2) should able to use custom settings`, done => {
    stream = webserver({
      open: false,
      debugger: {
        enable: true,
        namespace: customNamespace
      }
    });
    stream.write(rootDir);

    client = io.connect([defaultUrl, customNamespace].join(''), options);

    client.on('connect', () => {
      expect(true).toBeTruthy();
    });

    client.on('hello', msg => {
      expect(msg).toBe(expectedMsg);
      done();
    });
  });
});

// -- EOF --
