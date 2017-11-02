'use strict';
/**
 * Testing the ioDebugger socket functions
 */
const request = require('supertest');
const webserver = require('../src/main.js');
const File = require('gulp-util').File;
const join = require('path').join;
const io = require('socket.io-client');
// Parameters
const { baseUrl, defaultUrl } = require('./fixtures/config.js');
// Some configuration to enable https testing
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// Setups
let stream;
let client;

const rootDir = new File({
  path: join(__dirname, 'fixtures')
});

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
  test.skip(`(1) should auto start ioDebugger and able to connect default namespace ${namespace}`, done => {
    stream = webserver();
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
      ioDebugger: {
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