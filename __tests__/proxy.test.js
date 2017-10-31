'use strict';
/**
 * Testing the proxy only here
 * don't want the suite to roll too many test in one go
 * besides the proxy is rely on a third party middleware
 */
const request = require('supertest');
const webserver = require('../src/main.js');
const File = require('gulp-util').File;
const join = require('path').join;
// Parameters
const { baseUrl, defaultUrl } = require('./fixtures/config.js');
// Some configuration to enable https testing
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// Setups
const rootDir = new File({
  path: join(__dirname, 'fixtures')
});
const directoryProxiedDir = new File({
  path: join(__dirname, 'fixtures', 'directoryProxied')
});
let stream;
let proxyStream;
const testPort = 8765;
// Create the proxy setup
beforeEach(() => {
  proxyStream = webserver({
    port: testPort,
    ioDebugger: false
  });
  proxyStream.write(directoryProxiedDir);
});
// Clean up afterward
afterEach(() => {
  if (stream) {
    stream.emit('kill');
    stream = undefined;
  }
  if (proxyStream) {
    proxyStream.emit('kill');
    proxyStream = undefined;
  }
});
// Test start
describe('gulp-webserver-io proxy test', () => {
  // (0)
  test.skip(`(0) test the ${testPort} proxy version works first!`, () => {
    return request(['http://', baseUrl, ':', testPort].join(''))
      .get('/')
      .expect(200, /I am Ron Burgandy?/);
  });

  // (1)
  test(`(1) should proxy request to http://localhost:${testPort}`, done => {
    const sourceUrl = '/api';
    const proxyUrl = ['http://', baseUrl, ':', testPort].join('');
    // Create basic server
    stream = webserver({
      port: 3030,
      ioDebugger: false,
      proxies: [
        {
          source: sourceUrl,
          target: proxyUrl
        }
      ]
    });
    stream.write(rootDir);
    // Try the proxy server
    request(proxyUrl)
      .get('/api')
      .expect(200, /I am API/)
      .end(err => {
        if (err) {
          done(err);
        }
        // Fetch normally
        request(defaultUrl)
          .get('/')
          .expect(200, /Hello World/)
          .end(err => {
            if (err) {
              return done(err);
            }
            // Fetch from the proxied
            request(defaultUrl)
              .get(sourceUrl)
              .expect(
                200 // , /I am Ron Burgandy?/
              )
              .end(err => {
                if (err) {
                  console.log('[request error]', err);
                  return done(err);
                }
                done(err);
              });
          });
      });
  });
});

// -- EOF --