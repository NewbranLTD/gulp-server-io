'use strict';
jest.setTimeout(10000);
/**
 * Testing the ioDebugger socket functions
 * @TODO use this for testing reload at port 9856
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
  defaultSSLUrl
} = require('../fixtures/config.js');
// Socket options
const customNamespace = '/my-custom-namespace';
const expectedMsg = 'IO DEBUGGER is listening ...';
const options = {
  transports: ['websocket'],
  'force new connection': true
};
// Start test with socket
describe('gulp-webserver-io debugger custom option test', () => {
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

  test(`should able to use custom settings ${customNamespace}`, done => {
    stream = webserver({
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
